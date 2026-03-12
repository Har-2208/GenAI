from fastapi import APIRouter, Request
from datetime import datetime
from services.analyze_service import analyze_user
from services.result_service import save_result, get_result
from services.feedback_service import save_feedback
from services.analytics_service import track_event

router = APIRouter()

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
    return analyze_user(data)

# Save career results
@router.post("/api/results/save")
async def save_results(request: Request):
    data = await request.json()
    return save_result(data)

# Get saved result
@router.get("/api/results/{result_id}")
def get_results(result_id: str):
    return get_result(result_id)

# Submit feedback
@router.post("/api/feedback")
async def feedback(request: Request):
    data = await request.json()
    return save_feedback(data)

# Analytics tracking
@router.post("/api/analytics/track")
async def analytics(request: Request):
    data = await request.json()
    return track_event(data)