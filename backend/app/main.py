from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, quiz, workflow
from app.init_db import init

app = FastAPI(title="LearnPath AI", version="0.1.0")

@app.on_event("startup")
def on_startup():
    init()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["quiz"])
app.include_router(workflow.router, prefix="/api/workflow", tags=["workflow"])


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "learnpath-ai"}
