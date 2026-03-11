from fastapi import APIRouter, Request
from datetime import datetime
import uuid

router = APIRouter()

# temporary storage for prototype
saved_results = {}
feedback_list = []


# Health check
@router.get("/api/health")
def health():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow()
    }


# Analyze questionnaire
@router.post("/api/analyze")
async def analyze(request: Request):

    data = await request.json()

    # for now dummy response
    result = {
        "career_identity_summary": "You show strong analytical traits.",
        "top_careers": [
            {
                "name": "Machine Learning Engineer",
                "fit_reason": "Strong analytical thinking",
                "required_skills": ["Python", "Statistics"]
            },
            {
                "name": "Data Scientist",
                "fit_reason": "Interest in data analysis",
                "required_skills": ["Python", "SQL", "Machine Learning"]
            }
        ]
    }

    return result


# Save career results
@router.post("/api/results/save")
async def save_results(request: Request):

    data = await request.json()

    result_id = str(uuid.uuid4())

    saved_results[result_id] = data

    return {
        "id": result_id,
        "message": "Results saved successfully"
    }


# Get saved result
@router.get("/api/results/{result_id}")
def get_results(result_id: str):

    if result_id not in saved_results:
        return {"error": "Result not found"}

    return saved_results[result_id]


# Submit feedback
@router.post("/api/feedback")
async def feedback(request: Request):

    data = await request.json()

    feedback_list.append(data)

    return {"message": "Feedback received"}


# Analytics tracking
@router.post("/api/analytics/track")
async def track_event(request: Request):

    data = await request.json()

    print("Analytics event:", data)

    return {"status": "tracked"}
