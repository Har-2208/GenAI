import json
from llm_client import generate_content_with_failover

def extract_identity(user_input):

    prompt = f"""
    You are an AI career psychologist.

    STRICT RULES:
    - Use ONLY the allowed categories provided.
    - Do NOT invent new labels.
    - Return ONLY raw JSON.
    - Do NOT wrap response in markdown.
    - All fields must be filled.

    Allowed Interest Domains:
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

    Allowed Cognitive Styles:
    Analytical
    Creative
    Strategic
    Systems-Oriented
    Detail-Focused
    Big-Picture

    Allowed Motivation Drivers:
    Problem Solving
    Impact Creation
    Financial Growth
    Stability
    Recognition
    Innovation
    Autonomy
    Collaboration
    Leadership
    Learning Mastery

    Allowed Team Orientation:
    Strongly Individual
    Balanced
    Strongly Team-Oriented

    Allowed Structure Preference:
    Highly Structured
    Semi-Structured
    Flexible

    Allowed Risk Tolerance:
    Low
    Moderate
    High

    Allowed Learning Styles:
    Self-Directed
    Guided
    Hands-On
    Theoretical
    Collaborative

    Return JSON in this format:

    {{
    "interest_domains": [{{"domain": "", "weight": 0.0}}],
    "cognitive_style": {{"primary": "", "secondary": ""}},
    "motivation_drivers": [{{"driver": "", "intensity": 0.0}}],
    "work_preferences": {{
        "team_orientation": "",
        "structure_preference": "",
        "risk_tolerance": ""
    }},
    "learning_style": "",
    "confidence_score": 0.0
    }}

    User Response:
    \"\"\"{user_input}\"\"\"
    """

    raw_text, model_name = generate_content_with_failover(
        prompt,
        task_name="identity_extraction",
    )
    print(f"[extract] identity extracted using model: {model_name}")

    return json.loads(raw_text.strip())


# Test run
if __name__ == "__main__":
    sample_input = """
    I enjoy solving complex logical problems and building scalable systems.
    I prefer working independently but collaborating when needed.
    I am motivated by innovation and efficiency.
    """

    profile = extract_identity(sample_input)

    print("\nFinal Structured Profile:\n")
    print(json.dumps(profile, indent=4))