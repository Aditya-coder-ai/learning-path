from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db import get_db
from app.api.auth import get_current_user

router = APIRouter()


@router.get("/{workflow_id}")
def get_workflow(workflow_id: str, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    wf = db.execute(
        text("SELECT id, goal_skill, estimated_total_min, created_at FROM workflows WHERE id = :id AND user_id = :uid"),
        {"id": workflow_id, "uid": int(user_id)},
    ).fetchone()
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")

    steps = db.execute(
        text("""SELECT id, skill, action, content_url, estimated_min, is_completed
                 FROM workflow_steps WHERE workflow_id = :wid ORDER BY step_order"""),
        {"wid": workflow_id},
    ).fetchall()

    return {
        "id": wf[0],
        "goal": wf[1],
        "estimated_total_min": wf[2],
        "created_at": wf[3].isoformat() if wf[3] else "",
        "steps": [
            {
                "id": s[0],
                "skill": s[1],
                "action": s[2],
                "content_url": s[3],
                "estimated_min": s[4],
                "is_completed": bool(s[5]),
            }
            for s in steps
        ],
    }


@router.patch("/{workflow_id}/complete/{step_id}")
def complete_step(workflow_id: str, step_id: int, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    db.execute(
        text("""UPDATE workflow_steps SET is_completed = 1
                 WHERE id = :sid AND workflow_id = :wid
                 AND EXISTS (SELECT 1 FROM workflows WHERE id = :wid2 AND user_id = :uid)"""),
        {"sid": step_id, "wid": workflow_id, "wid2": workflow_id, "uid": int(user_id)},
    )
    db.commit()
    return {"status": "ok"}
