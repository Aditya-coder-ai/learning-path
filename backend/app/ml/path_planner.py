from collections import deque
from .skill_mapper import SKILLS, load_skill_graph

MASTERY_THRESHOLD = 0.6


def plan_path(mastery: dict[str, float], goal: str, max_steps: int = 15) -> list[dict]:
    graph = load_skill_graph()
    if goal not in graph:
        graph[goal] = []

    needs_work = {s for s in SKILLS if mastery.get(s, 0) < MASTERY_THRESHOLD}

    if goal not in needs_work and all(
        p not in needs_work for p in graph.get(goal, [])
    ):
        return []

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
            for prereq in graph.get(skill, []):
                if prereq not in visited:
                    queue.append(prereq)

    sorted_skills = topological_sort(list(required), graph)

    steps = []
    for skill in sorted_skills:
        if mastery.get(skill, 0) < MASTERY_THRESHOLD:
            action = "review" if mastery.get(skill, 0) > 0.3 else "learn"
            steps.append({
                "skill": skill,
                "action": action,
                "estimated_min": 15 if action == "review" else 30,
            })

    if len(steps) > max_steps:
        steps = steps[:max_steps]
        steps.append({
            "skill": goal,
            "action": "project",
            "estimated_min": 45,
        })
    else:
        steps.append({
            "skill": goal,
            "action": "project",
            "estimated_min": 45,
        })

    return steps


def topological_sort(skills: list[str], graph: dict) -> list[str]:
    adj = {s: [] for s in skills}
    in_deg = {s: 0 for s in skills}

    for s in skills:
        for p in graph.get(s, []):
            if p in skills:
                adj.setdefault(p, []).append(s)
                in_deg[s] = in_deg.get(s, 0) + 1

    queue = deque([s for s in skills if in_deg.get(s, 0) == 0])
    result = []

    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in adj.get(node, []):
            in_deg[neighbor] -= 1
            if in_deg[neighbor] == 0:
                queue.append(neighbor)

    remaining = [s for s in skills if s not in result]
    result.extend(remaining)

    return result
