from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    goal_skill: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class QuizSubmission(BaseModel):
    answers: list[int]
    goal_skill: str


class QuizResult(BaseModel):
    skills: dict[str, float]
    workflow_id: str


class WorkflowStep(BaseModel):
    id: int
    skill: str
    action: str
    content_url: Optional[str] = None
    estimated_min: int
    is_completed: bool


class Workflow(BaseModel):
    id: str
    goal: str
    estimated_total_min: int
    steps: list[WorkflowStep]
    created_at: str


class StepComplete(BaseModel):
    step_id: int
