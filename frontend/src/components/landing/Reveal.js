import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

export const Reveal = ({ children, delay = 0, y = 36, className = "", ...rest }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.8, delay, ease: EASE }}
    {...rest}
  >
    {children}
  </motion.div>
);

export const MaskedLines = ({ lines, className = "", delay = 0, stagger = 0.13 }) => (
  <span className={className}>
    {lines.map((line, i) => (
      <span className="mask-line" key={i}>
        <motion.span
          className="block"
          initial={{ y: "115%", rotate: 2 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ duration: 1, delay: delay + i * stagger, ease: EASE }}
        >
          {line}
        </motion.span>
      </span>
    ))}
  </span>
);

export const SectionHead = ({ eyebrow, title, desc, light = false, align = "left", id }) => (
  <Reveal className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
    {eyebrow && (
      <p className="eyebrow text-brand-orange mb-4" data-testid={`${id}-eyebrow`}>
        {eyebrow}
      </p>
    )}
    <h2
      className={`font-serif text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.1] tracking-tight ${light ? "text-white" : "text-navy"}`}
      data-testid={`${id}-title`}
    >
      {title}
    </h2>
    {desc && <p className={`mt-5 text-base md:text-lg leading-relaxed ${light ? "text-slate-300" : "text-slate-600"}`}>{desc}</p>}
  </Reveal>
);
