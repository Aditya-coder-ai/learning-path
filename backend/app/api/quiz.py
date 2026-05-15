import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db import get_db
from app.api.auth import get_current_user
from app.models.schemas import QuizSubmission
from app.ml.skill_mapper import map_skills
from app.ml.path_planner import plan_path
from app.ml.content_ranker import rank_content

router = APIRouter()


@router.post("/submit")
def submit_quiz(body: QuizSubmission, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    mastery = map_skills(body.answers)
    steps = plan_path(mastery, body.goal_skill)

    total_min = sum(s["estimated_min"] for s in steps)
    workflow_id = str(uuid.uuid4())[:8]

    db.execute(
        text("""INSERT INTO workflows (id, user_id, goal_skill, estimated_total_min)
                 VALUES (:id, :uid, :goal, :total)"""),
        {"id": workflow_id, "uid": int(user_id), "goal": body.goal_skill, "total": total_min},
    )

    for order, step in enumerate(steps):
        content = rank_content(step["skill"])
        db.execute(
            text("""INSERT INTO workflow_steps
                     (workflow_id, step_order, skill, action, content_url, estimated_min)
                     VALUES (:wid, :order, :skill, :action, :url, :min)"""),
            {
                "wid": workflow_id,
                "order": order,
                "skill": step["skill"],
                "action": step["action"],
                "url": content[0]["url"] if content else "",
                "min": step["estimated_min"],
            },
        )

    db.commit()

    return {
        "skills": {k: round(v, 2) for k, v in sorted(mastery.items(), key=lambda x: x[1])},
        "workflow_id": workflow_id,
    }
