import os
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent
ENV_PATH = PROJECT_ROOT / ".env"


def _strip_wrapping_quotes(value):
    if len(value) >= 2 and value[0] == value[-1] and value[0] in ('"', "'"):
        return value[1:-1]
    return value


def load_env_file(env_path=ENV_PATH):
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue

        if "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = _strip_wrapping_quotes(value.strip())

        if key:
            os.environ.setdefault(key, value)


def get_required_env(name):
    value = os.getenv(name)
    if value:
        return value

    raise RuntimeError(
        f"Missing required environment variable '{name}'. "
        "Create a .env file from .env.example and set it."
    )


load_env_file()

GEMINI_API_KEY = get_required_env("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "models/gemini-2.5-flash")
GEMINI_MODELS = [
    model.strip()
    for model in os.getenv("GEMINI_MODELS", GEMINI_MODEL).split(",")
    if model.strip()
]
CAREER_DB_PATH = os.getenv("CAREER_DB_PATH", "career_db.db")