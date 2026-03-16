import re
import time

from google import genai

from settings import GEMINI_API_KEY, GEMINI_MODEL, GEMINI_MODELS


client = genai.Client(api_key=GEMINI_API_KEY)


def _is_retryable_quota_error(exc):
    message = str(exc).lower()
    return (
        "resource_exhausted" in message
        or "quota" in message
        or "rate limit" in message
        or "429" in message
    )


def _extract_retry_seconds(exc):
    message = str(exc).lower()
    match = re.search(r"retry in\s+([0-9]+(?:\.[0-9]+)?)s", message)
    if not match:
        return 0

    try:
        return max(0, int(float(match.group(1))))
    except ValueError:
        return 0


def _get_candidate_models():
    models = [m for m in GEMINI_MODELS if m]
    if not models:
        models = [GEMINI_MODEL]
    return models


def generate_content_with_failover(prompt, task_name="generation"):
    models = _get_candidate_models()
    last_exc = None
    max_retry_delay = 0

    # First pass: rotate through each model once.
    for model_name in models:
        try:
            response = client.models.generate_content(model=model_name, contents=prompt)
            return response.text, model_name
        except Exception as exc:
            last_exc = exc
            print(f"[llm_client] {task_name} failed on {model_name}: {exc}")

            if not _is_retryable_quota_error(exc):
                raise

            max_retry_delay = max(max_retry_delay, _extract_retry_seconds(exc))

    # Second pass: wait once and try all models again.
    if max_retry_delay > 0:
        wait_seconds = min(max_retry_delay, 30)
        print(f"[llm_client] Waiting {wait_seconds}s before retrying models for {task_name}.")
        time.sleep(wait_seconds)

        for model_name in models:
            try:
                response = client.models.generate_content(model=model_name, contents=prompt)
                return response.text, model_name
            except Exception as exc:
                last_exc = exc
                print(f"[llm_client] Retry failed on {model_name}: {exc}")
                if not _is_retryable_quota_error(exc):
                    raise

    raise last_exc