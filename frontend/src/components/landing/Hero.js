import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Play, Star } from "lucide-react";
import { MaskedLines } from "./Reveal";
import { scrollToId } from "@/hooks/useLenis";

const EASE = [0.22, 1, 0.36, 1];

export const Hero = ({ settings }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const lines = (settings.hero_title || "").split("\n").filter(Boolean);

  return (
    <section
      id="home"
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative min-h-[100svh] overflow-hidden bg-white pt-32 pb-40 md:pt-40"
      data-testid="hero-section"
    >
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(23,43,77,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(23,43,77,0.06)_1px,transparent_1px)] [background-size:64px_64px]" />
      <motion.div style={{ scale: glowScale }} className="pointer-events-none absolute -right-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-sky/25 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-brand-yellow/25 blur-[140px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-12">
        <motion.div style={{ y: textY }} className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-white"
            data-testid="hero-badge"
          >
            <Star size={12} fill="currentColor" /> {settings.hero_badge}
          </motion.div>

          <h1 className="mt-7 font-serif text-4xl font-semibold leading-[1.02] tracking-tight text-[#0F172A] sm:text-5xl lg:text-[4.6rem]" data-testid="hero-title">
            <MaskedLines lines={lines} delay={0.4} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
            className="mt-8 max-w-xl text-base leading-relaxed text-slate-700 md:text-lg"
            data-testid="hero-subtitle"
          >
            {settings.hero_subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.3, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <button onClick={() => scrollToId("daftar")} className="btn-orange" data-testid="hero-cta-button">
              {settings.hero_cta} <ArrowRight size={16} />
            </button>
            <button onClick={() => scrollToId("program")} className="btn-pill border border-navy/20 bg-white text-navy hover:-translate-y-1 hover:bg-navy hover:text-white" data-testid="hero-secondary-button">
              <Play size={14} fill="currentColor" /> Lihat Program
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: imgY, perspective: 1200 }}
          className="relative lg:col-span-5"
          initial={{ opacity: 0, scale: 0.9, y: 60 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: EASE }}
        >
          <motion.div style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }} className="relative">
            <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-brand-orange/60 via-transparent to-sky/50 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2.2rem] border border-navy/10 shadow-[0_40px_80px_-30px_rgba(23,43,77,0.5)]">
              <img src={settings.hero_image} alt="Siswa belajar bersama tutor" className="aspect-[4/5] w-full object-cover" data-testid="hero-image" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-transparent to-transparent" />
              <div className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-xl">
                <div>
                  <p className="eyebrow text-brand-yellow">Tutor Bersertifikat</p>
                  <p className="mt-1 font-serif text-lg text-white">Datang ke rumah Anda</p>
                </div>
                <div className="flex -space-x-2">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-9 w-9 rounded-full border-2 border-navy bg-gradient-to-br from-brand-orange to-brand-yellow" />
                  ))}
                </div>
              </div>
            </div>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
