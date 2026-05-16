import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WorkflowViewer({ workflowId }: { workflowId: string }) {
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!workflowId) return;
    const fetchWorkflow = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`/api/workflow/${workflowId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setWorkflow(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkflow();
  }, [workflowId]);

  const completeStep = async (stepId: number) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`/api/workflow/${workflowId}/complete/${stepId}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkflow((prev) => ({
        ...prev,
        steps: prev.steps.map((s) =>
          s.id === stepId ? { ...s, is_completed: true } : s
        ),
      }));
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-12 h-12 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-white/40">Building your personalized workflow...</p>
      </div>
    );
  }

  if (error || !workflow) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <p className="text-red-400/80 text-lg mb-2">Workflow not found</p>
        <p className="text-white/30 text-sm">Try submitting the quiz again.</p>
      </div>
    );
  }

  const completed = workflow.steps.filter((s) => s.is_completed).length;
  const total = workflow.steps.length;
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-8 glow-border"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full mb-3 inline-block">
              Your Workflow
            </span>
            <h2 className="text-3xl font-bold text-white mt-1">
              {workflow.goal
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
            </h2>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-white">
              {completed}/{total}
            </div>
            <div className="text-xs text-white/30">steps done</div>
          </div>
        </div>

        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
          />
        </div>
        <div className="flex justify-between text-xs text-white/30">
          <span>Progress</span>
          <span>{workflow.estimated_total_min} min estimated</span>
        </div>
      </motion.div>

      <div className="relative">
        <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/30 via-purple-500/20 to-transparent" />

        <AnimatePresence>
          {workflow.steps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className={`relative glass rounded-xl p-5 ml-12 mb-4 transition-all duration-300 ${
                step.is_completed
                  ? "border-green-500/20 bg-green-500/5"
                  : "glass-hover"
              }`}
            >
              <div
                className={`absolute -left-[33px] top-6 w-[22px] h-[22px] rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  step.is_completed
                    ? "bg-green-500/20 border-green-500 text-green-400"
                    : "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                }`}
              >
                {step.is_completed ? "✓" : idx + 1}
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="font-semibold text-white capitalize">
                      {step.skill.replace(/_/g, " ")}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        step.action === "learn"
                          ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                          : step.action === "review"
                          ? "bg-yellow-500/10 text-yellow-300 border border-yellow-500/20"
                          : "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                      }`}
                    >
                      {step.action}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    {step.content_url && (
                      <a
                        href={step.content_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Open resource
                      </a>
                    )}
                    <span className="text-xs text-white/20">{step.estimated_min} min</span>
                  </div>
                </div>

                {!step.is_completed && (
                  <button
                    onClick={() => completeStep(step.id)}
                    className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-white/50 hover:bg-green-500/10 hover:border-green-500/30 hover:text-green-400 transition-all"
                  >
                    Done
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {pct === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-8 text-center border-green-500/20 glow-border"
        >
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-xl font-bold text-white mb-1">Workflow Complete!</h3>
          <p className="text-white/40 text-sm">You've mastered this learning path.</p>
        </motion.div>
      )}
    </div>
  );
}
