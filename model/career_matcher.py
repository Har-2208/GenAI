import math

# -------- Interest Score --------
def score_interest(identity, career):

    user_domains = [d["domain"] for d in identity["interest_domains"]]
    career_domains = career["interest_alignment"]

    matches = len(set(user_domains) & set(career_domains))

    return matches / max(len(career_domains), 1)


# -------- Cognitive Score --------
def score_cognitive(identity, career):

    styles = [
        identity["cognitive_style"]["primary"],
        identity["cognitive_style"]["secondary"]
    ]

    career_styles = career["cognitive_style_required"]

    matches = len(set(styles) & set(career_styles))

    return matches / max(len(career_styles), 1)


# -------- Motivation Score --------
def score_motivation(identity, career):

    drivers = [d["driver"] for d in identity["motivation_drivers"]]

    career_drivers = career["motivation_alignment"]

    matches = len(set(drivers) & set(career_drivers))

    return matches / max(len(career_drivers), 1)


# -------- Work Style Score --------
def score_work_style(identity, career):

    score = 0

    prefs = identity["work_preferences"]
    work = career["work_style"]

    if prefs["team_orientation"] == work["team_orientation"]:
        score += 1

    if prefs["structure_preference"] == work["structure_preference"]:
        score += 1

    if prefs["risk_tolerance"] == work["risk_tolerance"]:
        score += 1

    return score / 3


# -------- Final Score --------
def compute_match_score(identity, career):

    interest = score_interest(identity, career)
    cognitive = score_cognitive(identity, career)
    motivation = score_motivation(identity, career)
    work = score_work_style(identity, career)

    final_score = (
        0.35 * interest +
        0.30 * cognitive +
        0.20 * motivation +
        0.15 * work
    )

    return round(final_score * 100, 2)


# -------- ADD THIS BELOW THE SCORING FUNCTIONS --------
def rank_careers(identity, careers):

    scored = []

    for career in careers:

        score = compute_match_score(identity, career)

        scored.append({
            "career_name": career["career_name"],
            "score": score,
            "career": career
        })

    scored.sort(key=lambda x: x["score"], reverse=True)

    return scored[:5]

def analyze_skill_gap(identity, career):

    user_domains = [d["domain"] for d in identity["interest_domains"]]
    career_domains = career["interest_alignment"]

    strengths = []
    gaps = []

    # Check domain alignment
    for d in career_domains:
        if d in user_domains:
            strengths.append(f"Interest in {d}")
        else:
            gaps.append(f"Develop stronger exposure to {d}")

    # Skills required
    required_skills = career.get("core_skills", [])

    for skill in required_skills:
        gaps.append(skill)

    return {
        "strengths": strengths,
        "gaps": gaps
    }