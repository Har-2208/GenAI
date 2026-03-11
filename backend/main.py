from fastapi import FastAPI
from routes.career_routes import router

app = FastAPI()

app.include_router(router)

@app.get("/")
def home():
    return {"message": "AI Career Finder Backend Running"}
