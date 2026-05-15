import json
from flask import Flask, request, jsonify

from models.skill_graph import SKILL_GRAPH

app = Flask(__name__)

SKILLS = sorted(SKILL_GRAPH.keys())


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "skills_count": len(SKILLS)})


@app.route("/graph", methods=["GET"])
def get_graph():
    return jsonify(SKILL_GRAPH)


@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    quiz_answers = data.get("answers", [])
    goal = data.get("goal", "")

    mastery = simple_score(quiz_answers)
    steps = build_path(mastery, goal)

    return jsonify({
        "mastery": {k: round(v, 2) for k, v in mastery.items()},
        "steps": steps,
    })


def simple_score(answers: list[int]) -> dict[str, float]:
    base = 0.2
    mastery = {s: base for s in SKILLS}
    question_skills = [
        "variables", "data_types", "conditionals", "loops", "functions",
        "arrays", "strings", "recursion", "sorting", "searching",
        "oop_classes", "linked_lists", "stacks_queues", "trees",
        "hash_tables", "time_complexity", "dynamic_programming",
        "graphs", "bit_manipulation", "math_fundamentals",
    ]
    for i, ans in enumerate(answers):
        if i < len(question_skills) and ans:
            skill = question_skills[i]
            mastery[skill] = min(mastery[skill] + 0.15, 1.0)
        elif i < len(question_skills):
            skill = question_skills[i]
            mastery[skill] = max(mastery[skill] - 0.05, 0.0)
    return mastery


def build_path(mastery, goal):
    threshold = 0.6
    from collections import deque

    needs_work = {s for s in SKILLS if mastery.get(s, 0) < threshold}

    required = set()
    queue = deque([goal])
    visited = set()
    while queue:
        skill = queue.popleft()
        if skill in visited:
            continue
        visited.add(skill)
        if skill in needs_work or skill == goal:
            required.add(skill)
            for prereq in SKILL_GRAPH.get(skill, []):
                if prereq not in visited:
                    queue.append(prereq)

    sorted_skills = list(dict.fromkeys(required))
    steps = []
    for skill in sorted_skills:
        if mastery.get(skill, 0) < threshold:
            action = "review" if mastery.get(skill, 0) > 0.3 else "learn"
            steps.append({
                "skill": skill,
                "action": action,
                "estimated_min": 15 if action == "review" else 30,
            })
    steps.append({"skill": goal, "action": "project", "estimated_min": 45})
    return steps


if __name__ == "__main__":
    app.run(port=5000, debug=True)
