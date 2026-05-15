import json
import os
import numpy as np

SKILL_GRAPH_PATH = os.path.join(
    os.path.dirname(__file__), "..", "..", "..", "ml-service", "models", "skill_graph.json"
)

SKILLS = [
    "variables", "data_types", "conditionals", "loops",
    "functions", "arrays", "strings", "recursion",
    "sorting", "searching", "oop_classes", "oop_inheritance",
    "linked_lists", "stacks_queues", "trees", "graphs",
    "dynamic_programming", "greedy", "time_complexity",
    "space_complexity", "pointers", "hash_tables",
    "bit_manipulation", "math_fundamentals", "probability",
]

QUESTION_SKILL_MAP = [
    ("variables", 0), ("data_types", 1), ("conditionals", 2),
    ("loops", 3), ("functions", 4), ("arrays", 5),
    ("strings", 6), ("recursion", 7), ("sorting", 8),
    ("searching", 9), ("oop_classes", 10), ("linked_lists", 12),
    ("stacks_queues", 13), ("trees", 14), ("hash_tables", 21),
    ("time_complexity", 18), ("dynamic_programming", 16),
    ("graphs", 15), ("bit_manipulation", 22), ("math_fundamentals", 23),
]


class BKTModel:
    def __init__(self, p_learn=0.3, p_guess=0.15, p_slip=0.1, p_init=0.2):
        self.p_learn = p_learn
        self.p_guess = p_guess
        self.p_slip = p_slip
        self.p_init = p_init

    def update(self, p_known: float, correct: int) -> float:
        p_correct = p_known * (1 - self.p_slip) + (1 - p_known) * self.p_guess
        if correct:
            p_known_given_correct = (p_known * (1 - self.p_slip)) / p_correct
        else:
            p_known_given_incorrect = (p_known * self.p_slip) / (1 - p_correct)
            p_known_given_correct = p_known_given_incorrect
        p_known_new = p_known_given_correct + (1 - p_known_given_correct) * self.p_learn
        return min(p_known_new, 1.0)


def map_skills(answers: list[int]) -> dict[str, float]:
    model = BKTModel()
    mastery = {skill: model.p_init for skill in SKILLS}

    for i, answer in enumerate(answers):
        if i >= len(QUESTION_SKILL_MAP):
            break
        skill_name, _ = QUESTION_SKILL_MAP[i]
        mastery[skill_name] = model.update(mastery[skill_name], answer)

    return mastery


def load_skill_graph() -> dict:
    if os.path.exists(SKILL_GRAPH_PATH):
        with open(SKILL_GRAPH_PATH) as f:
            return json.load(f)
    return {
        "variables": [],
        "data_types": ["variables"],
        "conditionals": ["variables"],
        "loops": ["variables"],
        "functions": ["variables", "data_types"],
        "arrays": ["variables", "loops"],
        "strings": ["variables", "arrays"],
        "recursion": ["functions", "conditionals"],
        "sorting": ["arrays", "loops", "time_complexity"],
        "searching": ["arrays", "time_complexity"],
        "oop_classes": ["functions", "data_types"],
        "oop_inheritance": ["oop_classes"],
        "linked_lists": ["pointers", "arrays"],
        "stacks_queues": ["arrays", "functions"],
        "trees": ["recursion", "linked_lists", "pointers"],
        "graphs": ["trees"],
        "dynamic_programming": ["recursion", "arrays", "time_complexity"],
        "greedy": ["sorting", "time_complexity"],
        "time_complexity": ["math_fundamentals"],
        "space_complexity": ["time_complexity"],
        "pointers": ["variables"],
        "hash_tables": ["arrays", "functions"],
        "bit_manipulation": ["math_fundamentals"],
        "math_fundamentals": [],
        "probability": ["math_fundamentals"],
    }
