import json

def analyze_user(data):

    analytical = data.get("analytical", 0)
    creative = data.get("creative", 0)
    people = data.get("people_oriented", 0)
    risk = data.get("risk_tolerance", 0)

    # simple logic for prototype
    if analytical >= creative:
        top_careers = [
            {
                "name": "Machine Learning Engineer",
                "fit_reason": "Strong analytical thinking",
                "required_skills": ["Python", "Statistics", "Machine Learning"]
            },
            {
                "name": "Data Scientist",
                "fit_reason": "Interest in data and problem solving",
                "required_skills": ["Python", "SQL", "Data Analysis"]
            }
        ]
    else:
        top_careers = [
            {
                "name": "UI/UX Designer",
                "fit_reason": "High creativity and visual thinking",
                "required_skills": ["Figma", "Design Thinking", "User Research"]
            },
            {
                "name": "Product Designer",
                "fit_reason": "Strong creative mindset",
                "required_skills": ["Prototyping", "UX Research"]
            }
        ]

    return {
        "career_identity_summary": "Based on your personality traits",
        "top_careers": top_careers
    }