import sys
import os
import importlib.util
from pathlib import Path


# Ensure model modules are importable when backend runs from the backend folder.
MODEL_DIR = Path(__file__).resolve().parents[2] / "model"
if str(MODEL_DIR) not in sys.path:
    sys.path.insert(0, str(MODEL_DIR))


def _load_model_module(module_name, filename):
    spec = importlib.util.spec_from_file_location(module_name, MODEL_DIR / filename)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


_career_matcher = _load_model_module("career_matcher", "career_matcher.py")
_extract = _load_model_module("extract", "extract.py")
_model_main = _load_model_module("model_main", "main.py")

analyze_skill_gap = _career_matcher.analyze_skill_gap
rank_careers = _career_matcher.rank_careers
extract_identity = _extract.extract_identity
expand_database = _model_main.expand_database
filter_careers_by_domain = _model_main.filter_careers_by_domain
normalize_career_profile = _model_main.normalize_career_profile


INTEREST_TO_DOMAIN = {
    "technology": "Technology & Engineering",
    "engineering": "Technology & Engineering",
    "healthcare": "Healthcare & Life Sciences",
    "medical": "Healthcare & Life Sciences",
    "business": "Business & Strategy",
    "entrepreneurship": "Entrepreneurship",
    "design": "Creative & Design",
    "arts": "Creative & Design",
    "finance": "Finance & Economics",
    "economics": "Finance & Economics",
    "research": "Research & Academia",
    "science": "Research & Academia",
    "social": "Social Impact & Policy",
    "policy": "Social Impact & Policy",
    "management": "Operations & Management",
    "operations": "Operations & Management",
    "communication": "Communication & Media",
    "media": "Communication & Media",
}

RISK_TO_BUCKET = {
    "low": "Low",
    "moderate": "Moderate",
    "high": "High",
}


def _normalize_text(value):
    return str(value or "").strip().lower()


def _guess_domains(data):
    raw_values = data.get("interests", []) + data.get("subjectsLiked", [])
    scores = {}

    for value in raw_values:
        normalized = _normalize_text(value)
        for key, mapped_domain in INTEREST_TO_DOMAIN.items():
            if key in normalized:
                scores[mapped_domain] = scores.get(mapped_domain, 0) + 1

    if not scores:
        return [{"domain": "Technology & Engineering", "weight": 0.7}]

    total = float(sum(scores.values()))
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)[:3]
    return [{"domain": domain, "weight": round(count / total, 2)} for domain, count in ranked]


def _guess_cognitive_style(data):
    strengths = " ".join(data.get("strengths", [])).lower()

    if "creat" in strengths or "design" in strengths:
        return {"primary": "Creative", "secondary": "Big-Picture"}
    if "leader" in strengths or "strateg" in strengths:
        return {"primary": "Strategic", "secondary": "Big-Picture"}
    if "detail" in strengths:
        return {"primary": "Detail-Focused", "secondary": "Analytical"}

    return {"primary": "Analytical", "secondary": "Systems-Oriented"}


def _guess_motivation_drivers(data):
    strengths = " ".join(data.get("strengths", [])).lower()
    drivers = []

    if "problem" in strengths or "analyt" in strengths:
        drivers.append({"driver": "Problem Solving", "intensity": 0.9})
    if "leader" in strengths or "team" in strengths:
        drivers.append({"driver": "Leadership", "intensity": 0.75})
    if "creat" in strengths or "design" in strengths:
        drivers.append({"driver": "Innovation", "intensity": 0.75})

    if not drivers:
        drivers = [{"driver": "Learning Mastery", "intensity": 0.7}]

    return drivers[:3]


def _guess_work_preferences(data):
    work_style_text = _normalize_text(data.get("workStyle", ""))
    risk_text = _normalize_text(data.get("riskTolerance", ""))

    if "independent" in work_style_text or "individual" in work_style_text:
        team_orientation = "Strongly Individual"
    elif "team" in work_style_text or "collab" in work_style_text:
        team_orientation = "Strongly Team-Oriented"
    else:
        team_orientation = "Balanced"

    if "structured" in work_style_text:
        structure_preference = "Highly Structured"
    elif "flex" in work_style_text:
        structure_preference = "Flexible"
    else:
        structure_preference = "Semi-Structured"

    risk_tolerance = "Moderate"
    for key, mapped in RISK_TO_BUCKET.items():
        if key in risk_text:
            risk_tolerance = mapped
            break

    return {
        "team_orientation": team_orientation,
        "structure_preference": structure_preference,
        "risk_tolerance": risk_tolerance,
    }


def _fallback_identity_from_form(data):
    return {
        "interest_domains": _guess_domains(data),
        "cognitive_style": _guess_cognitive_style(data),
        "motivation_drivers": _guess_motivation_drivers(data),
        "work_preferences": _guess_work_preferences(data),
        "learning_style": "Self-Directed",
        "confidence_score": 0.6,
    }


def _extract_identity_with_fallback(user_input, data):
    try:
        return extract_identity(user_input), False
    except Exception as exc:
        print(f"[analyze_service] Gemini extract failed, using local fallback: {exc}")
        return _fallback_identity_from_form(data), True


def _join_list(values):
    if not values:
        return ""
    return ", ".join(values)


def _build_user_input(data):
    interests = _join_list(data.get("interests", []))
    strengths = _join_list(data.get("strengths", []))
    subjects = _join_list(data.get("subjectsLiked", []))
    work_style = data.get("workStyle", "")
    risk_tolerance = data.get("riskTolerance", "")

    return (
        f"My interests are: {interests}. "
        f"My strengths are: {strengths}. "
        f"I enjoy subjects like: {subjects}. "
        f"My preferred work style is: {work_style}. "
        f"My risk tolerance is: {risk_tolerance}."
    )


def _build_identity_summary(identity):
    domains = [entry.get("domain", "") for entry in identity.get("interest_domains", [])]
    cognitive = identity.get("cognitive_style", {})
    primary = cognitive.get("primary", "")
    secondary = cognitive.get("secondary", "")

    top_drivers = [entry.get("driver", "") for entry in identity.get("motivation_drivers", [])]
    preferences = identity.get("work_preferences", {})

    return (
        "Your profile reflects strong alignment with "
        f"{_join_list(domains)}. "
        f"Your cognitive style leans {primary} with {secondary} support. "
        f"Key motivation drivers include {_join_list(top_drivers)}. "
        "You prefer a work environment that is "
        f"{preferences.get('team_orientation', '')}, "
        f"{preferences.get('structure_preference', '')}, and "
        f"with {preferences.get('risk_tolerance', '')} risk tolerance."
    )


def _build_fit_reason(identity, career):
    user_domains = {entry.get("domain", "") for entry in identity.get("interest_domains", [])}
    matched_domains = [d for d in career.get("interest_alignment", []) if d in user_domains]

    if matched_domains:
        return f"Strong alignment with your interests in {_join_list(matched_domains)}."

    return "This role aligns with your overall cognitive and motivational profile."


def analyze_user(data):
    user_input = _build_user_input(data)
    identity, used_fallback = _extract_identity_with_fallback(user_input, data)

    # Dynamic expansion is part of the core pipeline. Keep it enabled by default.
    should_expand = os.getenv("ENABLE_DYNAMIC_CAREER_EXPANSION", "true").lower() == "true"
    if should_expand:
        try:
            expand_database(identity)
        except Exception as exc:
            print(f"[analyze_service] Career expansion skipped due to error: {exc}")

    user_domains = {
        entry.get("domain", "") for entry in identity.get("interest_domains", [])
    }

    all_careers = [
        normalize_career_profile(career)
        for career in getattr(_model_main, "careers", [])
    ]

    relevant_careers = [
        career for career in all_careers if career.get("domain") in user_domains
    ]

    if not relevant_careers:
        relevant_careers = all_careers

    ranked_careers = rank_careers(identity, relevant_careers)

    min_relevance_score = float(os.getenv("MIN_RELEVANCE_SCORE", "55"))
    highly_relevant = [
        ranked for ranked in ranked_careers if ranked.get("score", 0) >= min_relevance_score
    ]

    # If threshold is too strict for a given input, fall back to the single best result.
    selected_careers = highly_relevant if highly_relevant else ranked_careers[:1]

    top_careers = []
    for ranked in selected_careers[:3]:
        career = ranked["career"]
        gap_analysis = analyze_skill_gap(identity, career)

        top_careers.append(
            {
                "career_name": ranked["career_name"],
                "match_percentage": ranked["score"],
                "fit_reason": _build_fit_reason(identity, career),
                "required_skills": career.get("core_skills", []),
                "skill_gap": gap_analysis.get("gaps", []),
            }
        )

    response = {
        "career_identity_summary": _build_identity_summary(identity),
        "top_careers": top_careers,
    }

    if used_fallback:
        response["meta"] = {
            "used_fallback": True,
            "reason": "Gemini quota/rate limit reached; used local analyzer.",
        }

    response.setdefault("meta", {})["min_relevance_score"] = min_relevance_score

    return response