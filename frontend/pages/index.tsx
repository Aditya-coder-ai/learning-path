import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import Layout from "../components/Layout";

const ParticlesBackground = dynamic(
  () => import("../components/ParticlesBackground"),
  { ssr: false }
);

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const heroStats = [
  { label: "Quiz time", value: "2 min" },
  { label: "Adaptive steps", value: "Live" },
  { label: "Roadmap clarity", value: "High" },
];

const featureCards = [
  {
    title: "Signal over noise",
    desc: "Move from broad content dumps to an ordered path tuned to what you already know.",
    accent: "from-indigo-500/20 via-indigo-500/10 to-transparent",
  },
  {
    title: "Dependency-aware planning",
    desc: "The roadmap unlocks concepts in the right order so each step compounds the previous one.",
    accent: "from-cyan-500/20 via-sky-500/10 to-transparent",
  },
  {
    title: "Progress with momentum",
    desc: "Track completed steps, estimate total effort, and stay focused on the next best action.",
    accent: "from-fuchsia-500/20 via-violet-500/10 to-transparent",
  },
];

const steps = [
  {
    step: "01",
    title: "Diagnose your baseline",
    desc: "Answer a short quiz that identifies which fundamentals are already solid and where the gaps still are.",
  },
  {
    step: "02",
    title: "Generate an adaptive path",
    desc: "LearnPath ranks the next concepts, respects prerequisites, and builds a sequence for your goal.",
  },
  {
    step: "03",
    title: "Execute with confidence",
    desc: "Work through curated steps, mark them done, and keep the plan aligned with visible progress.",
  },
];

const experiencePoints = [
  "Polished glassmorphism UI with better spacing and hierarchy",
  "Animated data-network background that reacts to pointer movement",
  "Clear value framing for quiz, workflow, and progress tracking",
  "Conversion-focused CTA flow from hero to quiz",
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0.2]);
  const heroScale = useTransform(scrollYProgress, [0, 0.18], [1, 0.96]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  return (
    <Layout>
      <ParticlesBackground />

      <div className="relative z-10">
        <motion.section
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative min-h-screen px-4 sm:px-6 pt-28 pb-16 flex items-center"
        >
          <div className="absolute inset-x-0 top-24 h-[32rem] overflow-hidden pointer-events-none">
            <div className="hero-orb hero-orb-indigo w-80 h-80 left-[8%] top-12 animate-float" />
            <div className="hero-orb hero-orb-cyan w-72 h-72 right-[12%] top-0" />
            <div className="hero-orb hero-orb-purple w-96 h-96 right-[20%] bottom-0 animate-float" />
          </div>

          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="relative"
            >
              <motion.div variants={fadeUp} custom={0} className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] sm:text-xs font-medium tracking-[0.28em] uppercase text-indigo-200/90">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 pulse-ring" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300" />
                  </span>
                  AI learning path orchestration
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={1}
                className="max-w-4xl text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-black leading-[0.96] tracking-[-0.04em] mb-6"
              >
                Build a <span className="text-gradient">learning system</span>, not just a to-do list.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-lg sm:text-xl text-slate-300/70 max-w-2xl leading-relaxed mb-8"
              >
                LearnPath turns a short diagnostic into a clean, adaptive roadmap with the
                right concepts, sequence, and pacing for your target skill.
              </motion.p>

              <motion.div
                variants={fadeUp}
                custom={3}
                className="flex flex-col sm:flex-row gap-4 mb-10"
              >
                <Link
                  href="/quiz"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 text-white font-semibold text-lg overflow-hidden transition-all hover:shadow-2xl hover:shadow-indigo-500/30"
                >
                  <span>{token ? "Open My Workspace" : "Start the Adaptive Quiz"}</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/10 bg-white/[0.03] text-white/75 font-medium text-lg hover:bg-white/10 hover:border-cyan-400/30 transition-all"
                >
                  Explore the experience
                </a>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={4}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl"
              >
                {heroStats.map((stat) => (
                  <div key={stat.label} className="stat-pill rounded-2xl px-4 py-4">
                    <div className="text-2xl font-semibold text-white">{stat.value}</div>
                    <div className="text-sm text-white/45 mt-1">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="relative"
            >
              <div className="glass panel-gradient rounded-[2rem] p-6 sm:p-7 glow-border section-shell">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-white/35 mb-2">
                      Learning cockpit
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                      See the next best move instantly
                    </h2>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-400/30 to-cyan-400/20 border border-white/10 flex items-center justify-center text-cyan-200">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-5 mb-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.22em] text-cyan-200/70">Goal selected</div>
                      <div className="text-xl font-semibold text-white mt-1">Graphs and traversal</div>
                    </div>
                    <div className="rounded-full px-3 py-1 text-xs font-medium bg-cyan-500/10 border border-cyan-400/20 text-cyan-200">
                      Path ready
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Foundations", value: "Variables, loops, arrays", strong: true },
                      { label: "Prerequisite gap", value: "Recursion confidence needs work", strong: false },
                      { label: "Next step", value: "Practice BFS and DFS traversal", strong: true },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3"
                      >
                        <span className="text-sm text-white/45">{item.label}</span>
                        <span className={`text-sm ${item.strong ? "text-white" : "text-amber-200/80"}`}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/35 mb-2">Estimated plan</div>
                    <div className="text-3xl font-semibold text-white">7 steps</div>
                    <div className="text-sm text-white/45 mt-2">Curated in dependency order</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/35 mb-2">Momentum score</div>
                    <div className="text-3xl font-semibold text-white">82%</div>
                    <div className="text-sm text-white/45 mt-2">High readiness to progress</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <a
              href="#features"
              className="flex flex-col items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/35"
            >
              Scroll
              <div className="w-5 h-9 border-2 border-white/10 rounded-full flex justify-center">
                <div className="w-1 h-2 bg-indigo-300/70 rounded-full mt-2 animate-bounce" />
              </div>
            </a>
          </motion.div>
        </motion.section>

        <section id="features" className="py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="text-center mb-16"
            >
              <motion.p variants={fadeUp} custom={0} className="text-cyan-300 text-sm font-medium uppercase tracking-[0.3em] mb-4">
                Product Experience
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Designed to feel calm, clear, and intelligent
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-white/45 text-lg max-w-2xl mx-auto">
                The interface now frames the learning journey like a focused product, while the
                background animation reinforces the idea of an adaptive knowledge network.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featureCards.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="glass rounded-[1.75rem] p-8 glass-hover glow-border group relative overflow-hidden"
                >
                  <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${item.accent}`} />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-200 group-hover:scale-110 transition-transform mb-5">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M7 12h10M9 17h6" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3">{item.title}</h3>
                    <p className="text-white/45 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-24 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="glass rounded-[2rem] p-8 sm:p-10 glow-border"
            >
              <motion.p variants={fadeUp} custom={0} className="text-indigo-300 text-sm font-medium uppercase tracking-[0.28em]">
                How It Works
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl font-bold text-white mt-4">
                A smarter loop from signal to mastery
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-lg text-white/45 leading-relaxed mt-5">
                Every stage reduces uncertainty: diagnose skill level, generate a path, and
                keep the learner moving with focused next actions instead of overwhelming options.
              </motion.p>

              <motion.div variants={fadeUp} custom={3} className="space-y-3 mt-8">
                {experiencePoints.map((point) => (
                  <div
                    key={point}
                    className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-400/20 flex items-center justify-center text-cyan-200 shrink-0">
                      ✓
                    </div>
                    <span className="text-white/65">{point}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <div className="space-y-5">
              {steps.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="glass rounded-[1.75rem] p-7 sm:p-8 glass-hover"
                >
                  <div className="flex items-start gap-5">
                    <div className="text-5xl font-black tracking-[-0.04em] text-white/10">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-3">{item.title}</h3>
                      <p className="text-white/45 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="glass panel-gradient rounded-[2.25rem] px-8 py-10 sm:px-12 sm:py-14 text-center glow-border"
            >
              <motion.p variants={fadeUp} custom={0} className="text-sm uppercase tracking-[0.32em] text-cyan-300">
                Start Now
              </motion.p>
              <motion.h2 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl font-bold text-white mt-4">
                Turn uncertainty into a <span className="text-gradient">clear next step</span>
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-lg text-white/45 max-w-2xl mx-auto mt-5">
                Take the quiz, let the planner structure your path, and keep moving through the
                roadmap with visible momentum.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/quiz"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-indigo-500/30 transition-all"
                >
                  {token ? "Open Workspace" : "Generate My Roadmap"}
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/10 bg-white/[0.03] text-white/75 font-medium text-lg hover:bg-white/10 transition-all"
                >
                  Review the flow
                </a>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <footer className="py-8 px-4 sm:px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/25">
            <span>LearnPath AI</span>
            <span>Adaptive learning roadmap experience</span>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
