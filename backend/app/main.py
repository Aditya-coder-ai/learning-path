from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os
import redis.asyncio as redis
from fastapi_limiter import FastAPILimiter
from app.api import auth, quiz, workflow
from app.init_db import init

app = FastAPI(title="LearnPath AI", version="0.1.0")

@app.on_event("startup")
async def on_startup():
    init()
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
    try:
        redis_client = redis.from_url(redis_url, encoding="utf-8", decode_responses=True)
        await FastAPILimiter.init(redis_client)
        print("Rate Limiter Initialized")
    except Exception as e:
        print(f"Redis initialization failed: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(quiz.router, prefix="/quiz", tags=["quiz"])
app.include_router(workflow.router, prefix="/workflow", tags=["workflow"])


@app.get("/health")
def health():
    return {"status": "ok", "service": "learnpath-ai"}
