import json
import re

from career_data import add_career, career_exists, careers, load_careers
from extract import extract_identity
from llm_client import generate_content_with_failover
from career_matcher import rank_careers
from career_matcher import analyze_skill_gap

load_careers()

ALLOWED_DOMAINS = [
    "Technology & Engineering",
    "Business & Strategy",
    "Creative & Design",
    "Finance & Economics",
    "Healthcare & Life Sciences",
    "Research & Academia",
    "Social Impact & Policy",
    "Entrepreneurship",
    "Operations & Management",
    "Communication & Media",
]

ALLOWED_COGNITIVE_STYLES = [
    "Analytical",
    "Creative",
    "Strategic",
    "Systems-Oriented",
    "Detail-Focused",
    "Big-Picture",
]

ALLOWED_MOTIVATION_DRIVERS = [
    "Problem Solving",
    "Impact Creation",
    "Financial Growth",
    "Stability",
    "Recognition",
    "Innovation",
    "Autonomy",
    "Collaboration",
    "Leadership",
    "Learning Mastery",
]

ALLOWED_TEAM_ORIENTATION = [
    "Strongly Individual",
    "Balanced",
    "Strongly Team-Oriented",
]

ALLOWED_STRUCTURE_PREFERENCE = [
    "Highly Structured",
    "Semi-Structured",
    "Flexible",
]

ALLOWED_RISK_TOLERANCE = ["Low", "Moderate", "High"]

ALLOWED_LEARNING_STYLES = [
    "Self-Directed",
    "Guided",
    "Hands-On",
    "Theoretical",
    "Collaborative",
]


def _normalize_text(value):
    return str(value or "").strip().lower()


def _contains_any(text, keywords):
    return any(keyword in text for keyword in keywords)


def _map_domain(value):
    text = _normalize_text(value)

    if _contains_any(text, ["tech", "software", "engineer", "computer", "ai", "ml"]):
        return "Technology & Engineering"
    if _contains_any(text, ["business", "strategy", "product", "consult"]):
        return "Business & Strategy"
    if _contains_any(text, ["design", "creative", "art", "ux", "ui"]):
        return "Creative & Design"
    if _contains_any(text, ["finance", "econom", "quant", "trading"]):
        return "Finance & Economics"
    if _contains_any(text, ["health", "clinical", "medical", "bio", "genetic"]):
        return "Healthcare & Life Sciences"
    if _contains_any(text, ["research", "academ", "scientist", "laboratory"]):
        return "Research & Academia"
    if _contains_any(text, ["social", "policy", "public", "ngo", "impact"]):
        return "Social Impact & Policy"
    if _contains_any(text, ["startup", "entrepreneur", "founder"]):
        return "Entrepreneurship"
    if _contains_any(text, ["operations", "process", "program", "supply", "management"]):
        return "Operations & Management"
    if _contains_any(text, ["communication", "media", "content", "journal", "marketing"]):
        return "Communication & Media"

    return "Technology & Engineering"


def _normalize_domains(values, fallback_domain):
    mapped = []
    for value in values or []:
        mapped.append(_map_domain(value))

    if not mapped:
        mapped = [fallback_domain]

    unique = []
    for domain in mapped:
        if domain not in unique:
            unique.append(domain)

    return unique[:3]


def _normalize_cognitive_styles(values):
    text = " ".join(values or []).lower()
    styles = []

    if "analyt" in text or "logical" in text:
        styles.append("Analytical")
    if "creat" in text or "innov" in text:
        styles.append("Creative")
    if "strateg" in text:
        styles.append("Strategic")
    if "system" in text:
        styles.append("Systems-Oriented")
    if "detail" in text:
        styles.append("Detail-Focused")
    if "big" in text or "abstract" in text or "vision" in text:
        styles.append("Big-Picture")

    if not styles:
        styles = ["Analytical", "Systems-Oriented"]

    return styles[:3]


def _normalize_motivation(values):
    text = " ".join(values or []).lower()
    drivers = []

    if "problem" in text or "solve" in text:
        drivers.append("Problem Solving")
    if "impact" in text or "difference" in text:
        drivers.append("Impact Creation")
    if "financ" in text or "reward" in text:
        drivers.append("Financial Growth")
    if "stabil" in text or "security" in text:
        drivers.append("Stability")
    if "recogn" in text or "prestige" in text:
        drivers.append("Recognition")
    if "innov" in text or "create" in text:
        drivers.append("Innovation")
    if "autonom" in text or "independ" in text:
        drivers.append("Autonomy")
    if "collab" in text or "team" in text:
        drivers.append("Collaboration")
    if "leader" in text or "influenc" in text:
        drivers.append("Leadership")
    if "learn" in text or "master" in text:
        drivers.append("Learning Mastery")

    if not drivers:
        drivers = ["Problem Solving", "Learning Mastery"]

    return drivers[:4]


def _normalize_work_style(work_style):
    team_text = _normalize_text((work_style or {}).get("team_orientation", ""))
    structure_text = _normalize_text((work_style or {}).get("structure_preference", ""))
    risk_text = _normalize_text((work_style or {}).get("risk_tolerance", ""))

    if "individual" in team_text or "independ" in team_text:
        team = "Strongly Individual"
    elif "team" in team_text or "collab" in team_text:
        team = "Strongly Team-Oriented"
    else:
        team = "Balanced"

    if "high" in structure_text or "strict" in structure_text:
        structure = "Highly Structured"
    elif "flex" in structure_text or "adapt" in structure_text:
        structure = "Flexible"
    else:
        structure = "Semi-Structured"

    if "low" in risk_text:
        risk = "Low"
    elif "high" in risk_text:
        risk = "High"
    else:
        risk = "Moderate"

    return {
        "team_orientation": team,
        "structure_preference": structure,
        "risk_tolerance": risk,
    }


def _normalize_learning_styles(values):
    text = " ".join(values or []).lower()
    styles = []

    if "self" in text:
        styles.append("Self-Directed")
    if "guid" in text or "mentor" in text:
        styles.append("Guided")
    if "hands" in text or "experien" in text or "practic" in text:
        styles.append("Hands-On")
    if "theor" in text or "academic" in text:
        styles.append("Theoretical")
    if "collab" in text or "group" in text or "peer" in text:
        styles.append("Collaborative")

    if not styles:
        styles = ["Hands-On", "Self-Directed"]

    return styles[:3]


def normalize_career_profile(profile):
    career_name = str(profile.get("career_name", "")).strip()
    raw_domain = profile.get("domain", "")
    canonical_domain = _map_domain(raw_domain)

    interest_alignment = _normalize_domains(
        profile.get("interest_alignment", []),
        canonical_domain,
    )

    return {
        "career_name": career_name,
        "domain": canonical_domain,
        "interest_alignment": interest_alignment,
        "cognitive_style_required": _normalize_cognitive_styles(
            profile.get("cognitive_style_required", [])
        ),
        "motivation_alignment": _normalize_motivation(
            profile.get("motivation_alignment", [])
        ),
        "work_style": _normalize_work_style(profile.get("work_style", {})),
        "learning_style": _normalize_learning_styles(profile.get("learning_style", [])),
        "core_skills": profile.get("core_skills", []),
        "typical_responsibilities": profile.get("typical_responsibilities", []),
    }


def filter_careers_by_domain(identity):
    domains = [entry["domain"] for entry in identity["interest_domains"]]
    return [career for career in careers if career.get("domain") in domains]


def safe_parse_json(text):
    if not text:
        return None

    cleaned_text = text.strip().replace("```json", "").replace("```", "")
    match = re.search(r"\{.*\}", cleaned_text, re.DOTALL)
    if not match:
        return None

    try:
        return json.loads(match.group(0))
    except json.JSONDecodeError:
        return None


def suggest_new_careers(identity):
    prompt = f"""
You are a career exploration AI.
STRICT RULES:
- Return ONLY valid JSON.
- Do NOT wrap the output in markdown.
- Do NOT include explanations.
- Do NOT include text outside the JSON.

Based on this identity profile, suggest 5 possible career paths.

Return ONLY valid JSON in this format:

[
  {{
    "career_name": "",
    "reason": ""
  }}
]

Identity:
{json.dumps(identity, indent=2)}
"""

    raw, model_name = generate_content_with_failover(
        prompt,
        task_name="suggest_new_careers",
    )
    raw = raw.strip()
    print(f"[main] suggestions generated using model: {model_name}")
    print("\nGemini Output:\n")
    print(raw)

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        print("\nJSON parsing failed.")
        return []


def generate_career_profile(career_name):
    prompt = f"""
You are generating a structured career profile.

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanation text
- Use ONLY these allowed domains for both "domain" and "interest_alignment":
    Technology & Engineering
    Business & Strategy
    Creative & Design
    Finance & Economics
    Healthcare & Life Sciences
    Research & Academia
    Social Impact & Policy
    Entrepreneurship
    Operations & Management
    Communication & Media
- Use ONLY these values for "cognitive_style_required":
    Analytical, Creative, Strategic, Systems-Oriented, Detail-Focused, Big-Picture
- Use ONLY these values for "motivation_alignment":
    Problem Solving, Impact Creation, Financial Growth, Stability, Recognition,
    Innovation, Autonomy, Collaboration, Leadership, Learning Mastery
- Use ONLY these values for work_style.team_orientation:
    Strongly Individual, Balanced, Strongly Team-Oriented
- Use ONLY these values for work_style.structure_preference:
    Highly Structured, Semi-Structured, Flexible
- Use ONLY these values for work_style.risk_tolerance:
    Low, Moderate, High
- Use ONLY these values for "learning_style":
    Self-Directed, Guided, Hands-On, Theoretical, Collaborative

Return JSON in this format:

{{
  "career_name": "",
  "domain": "",
  "interest_alignment": [],
  "cognitive_style_required": [],
  "motivation_alignment": [],
  "work_style": {{
    "team_orientation": "",
    "structure_preference": "",
    "risk_tolerance": ""
  }},
  "learning_style": [],
  "core_skills": [],
  "typical_responsibilities": []
}}

Career:
{career_name}
"""

    raw, model_name = generate_content_with_failover(
        prompt,
        task_name="generate_career_profile",
    )
    print(f"[main] profile generated using model: {model_name}")
    print("\nCareer profile raw output:\n", raw)

    profile = safe_parse_json(raw)
    if not profile:
        print("Failed to parse Gemini output")
        return None

    return normalize_career_profile(profile)


def expand_database(identity):
    suggestions = suggest_new_careers(identity)

    for suggestion in suggestions:
        career_name = suggestion.get("career_name")
        if not career_name or career_exists(career_name):
            continue

        print("Adding new career:", career_name)
        profile = generate_career_profile(career_name)
        if profile:
            add_career(profile)
        else:
            print("Skipping invalid career profile")

    load_careers()
    return suggestions


if __name__ == "__main__":

    user_input = """
    I enjoy solving complex logical problems and building scalable systems.
    I prefer working independently but collaborating when needed.
    I am motivated by innovation and efficiency.
    """

    # Step 1 — Extract identity
    identity = extract_identity(user_input)
    print("\nUser Identity:\n", json.dumps(identity, indent=4))

    # Step 2 — Expand career database
    suggestions = expand_database(identity)

    print("\nSuggested Careers:\n")
    print(json.dumps(suggestions, indent=4))

    # Step 3 — Filter careers by domain
    relevant_careers = filter_careers_by_domain(identity)

    print("\nCareers matching user's domain interests:\n")
    print(json.dumps(relevant_careers, indent=4))

    # Step 4 — Rank careers
    ranked = rank_careers(identity, relevant_careers)

    if not ranked:
        print("No matching careers found.")
        exit()
        
    print("\nTop Career Matches:\n")

    for r in ranked:
        print(r["career_name"], "Score:", r["score"])
    
    # Step 5 — Skill gap analysis for best career
    best_career = ranked[0]["career"]

    gap_analysis = analyze_skill_gap(identity, best_career)

    print("\nRecommended Career:", best_career["career_name"])
    print("Match Score:", ranked[0]["score"], "%")

    print("\nYour Strengths:")
    for s in gap_analysis["strengths"]:
        print("-", s)

    print("\nSkills To Develop:")
    for g in gap_analysis["gaps"]:
        print("-", g)

    # Step 6 — Print final database
    print("\nCurrent Career Database:\n")
    print(json.dumps(careers, indent=4))