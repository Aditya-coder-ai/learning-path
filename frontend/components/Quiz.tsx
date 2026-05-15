import { useState } from "react";
import { motion } from "framer-motion";

const QUESTIONS = [
  { skill: "Variables", text: "Can you declare and assign a variable?" },
  { skill: "Data Types", text: "Do you know the difference between int, float, and string?" },
  { skill: "Conditionals", text: "Can you write an if-else statement?" },
  { skill: "Loops", text: "Can you write a for or while loop?" },
  { skill: "Functions", text: "Can you define and call a function?" },
  { skill: "Arrays", text: "Can you create and manipulate a list/array?" },
  { skill: "Strings", text: "Can you slice, join, and format strings?" },
  { skill: "Recursion", text: "Can you write a recursive function?" },
  { skill: "Sorting", text: "Do you know how quicksort or mergesort works?" },
  { skill: "Searching", text: "Can you implement binary search?" },
  { skill: "OOP Classes", text: "Can you define a class with methods?" },
  { skill: "Linked Lists", text: "Can you implement a linked list?" },
  { skill: "Stacks & Queues", text: "Do you know stack and queue operations?" },
  { skill: "Trees", text: "Can you traverse a binary tree?" },
  { skill: "Hash Tables", text: "Do you understand hash map collisions?" },
  { skill: "Time Complexity", text: "Can you analyze Big O of an algorithm?" },
  { skill: "Dynamic Prog.", text: "Can you solve a DP problem (e.g. Fibonacci)?" },
  { skill: "Graphs", text: "Do you know BFS/DFS traversal?" },
  { skill: "Bit Manipulation", text: "Can you use bitwise operators?" },
  { skill: "Math Fundamentals", text: "Comfortable with algebra and logic?" },
];

const GOALS = [
  "dynamic_programming",
  "sorting",
  "graphs",
  "trees",
  "recursion",
  "oop_inheritance",
];

export default function Quiz({ onSubmit }) {
  const [answers, setAnswers] = useState<number[]>(new Array(QUESTIONS.length).fill(-1));
  const [goal, setGoal] = useState(GOALS[0]);
  const [loading, setLoading] = useState(false);

  const answered = answers.filter((a) => a >= 0).length;
  const allAnswered = answered === QUESTIONS.length;

  const handleAnswer = (idx: number, val: number) => {
    const next = [...answers];
    next[idx] = val;
    setAnswers(next);
  };

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8000/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers, goal_skill: goal }),
      });
      const data = await res.json();
      onSubmit(data.workflow_id);
    } catch (err) {
      alert("Error submitting quiz. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-6 glow-border">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-white/60">
            Learning Goal
          </label>
          <span className="text-xs text-white/30">
            {answered}/{QUESTIONS.length} answered
          </span>
        </div>
        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer"
        >
          {GOALS.map((g) => (
            <option key={g} value={g} className="bg-[#0a0a1a]">
              {g.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>

        <div className="mt-3 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${(answered / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {QUESTIONS.map((q, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03, duration: 0.3 }}
          className={`glass rounded-2xl p-6 transition-all duration-300 ${
            answers[i] >= 0 ? "border-indigo-500/20" : ""
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="inline-block text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full mb-2">
                {q.skill}
              </span>
              <p className="text-white font-medium">{q.text}</p>
            </div>
            <span className="text-xs text-white/20 shrink-0 ml-4">
              {i + 1}/{QUESTIONS.length}
            </span>
          </div>
          <div className="flex gap-2">
            {[
              { label: "No", value: 0, color: "hover:border-red-500/30 hover:text-red-300" },
              { label: "Kinda", value: 1, color: "hover:border-yellow-500/30 hover:text-yellow-300" },
              { label: "Yes", value: 2, color: "hover:border-green-500/30 hover:text-green-300" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(i, opt.value)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                  answers[i] === opt.value
                    ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                    : "bg-white/5 border-white/5 text-white/40 " + opt.color
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>
      ))}

      <motion.button
        onClick={handleSubmit}
        disabled={!allAnswered || loading}
        initial={{ opacity: 0 }}
        animate={{ opacity: allAnswered ? 1 : 0.5 }}
        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
          allAnswered && !loading
            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-xl hover:shadow-indigo-500/25 cursor-pointer"
            : "bg-white/5 text-white/20 cursor-not-allowed"
        }`}
      >
        {loading
          ? "Analyzing..."
          : allAnswered
          ? "Generate My Learning Path"
          : `Answer ${QUESTIONS.length - answered} more questions`}
      </motion.button>
    </div>
  );
}
