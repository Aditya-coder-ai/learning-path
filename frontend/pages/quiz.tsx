import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import QuizForm from "../components/Quiz";
import WorkflowViewer from "../components/WorkflowViewer";

export default function QuizPage() {
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = authMode === "register" ? "register" : "login";
    const body: any = { email, password };
    if (authMode === "register") body.name = name;

    try {
      const res = await fetch(`/api/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        setToken(data.access_token);
        setEmail(""); setPassword(""); setName("");
      } else {
        alert(data.detail || "Auth failed");
      }
    } catch {
      alert("Backend not reachable or not running.");
    }
  };

  if (!token) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass rounded-2xl p-8 sm:p-10 w-full max-w-md glow-border"
          >
            <h2 className="text-3xl font-bold text-white mb-2">
              {authMode === "register" ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-white/40 text-sm mb-8">
              {authMode === "register"
                ? "Start your personalized learning journey."
                : "Continue where you left off."}
            </p>
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === "register" && (
                <div>
                  <label className="block text-sm text-white/50 mb-1.5">Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/50 mb-1.5">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
              >
                {authMode === "register" ? "Create Account" : "Sign In"}
              </button>
            </form>
            <p className="text-center text-sm text-white/30 mt-6">
              {authMode === "register" ? "Already have an account?" : "No account yet?"}{" "}
              <button
                onClick={() => setAuthMode(authMode === "register" ? "login" : "register")}
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {authMode === "register" ? "Sign in" : "Register"}
              </button>
            </p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-24 px-4 pb-16 max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {workflowId ? (
            <motion.div
              key="workflow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={() => setWorkflowId(null)}
                className="text-sm text-indigo-400 hover:text-indigo-300 mb-6 inline-flex items-center gap-1 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Take another quiz
              </button>
              <WorkflowViewer workflowId={workflowId} />
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-10">
                <h2 className="text-4xl font-bold text-white mb-2">Diagnostic Quiz</h2>
                <p className="text-white/40">
                  Answer honestly — this builds your personalized roadmap.
                </p>
              </div>
              <QuizForm onSubmit={(id: string) => setWorkflowId(id)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
