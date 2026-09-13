import { motion } from "framer-motion";

export const Stats = ({ stats = [] }) => (
  <div className="relative z-10 -mt-24 px-5 md:px-8" data-testid="stats-bar">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] backdrop-blur-xl md:grid-cols-4"
    >
      {stats.map((s, i) => (
        <div key={i} className="group bg-navy-deep/70 px-6 py-8 transition-colors duration-300 hover:bg-navy" data-testid={`stat-item-${i}`}>
          <p className="eyebrow text-brand-orange">0{i + 1}</p>
          <p className="mt-3 font-serif text-4xl text-white md:text-5xl">{s.value}</p>
          <p className="mt-2 text-sm text-slate-400 transition-colors duration-300 group-hover:text-slate-200">{s.label}</p>
        </div>
      ))}
    </motion.div>
  </div>
);
