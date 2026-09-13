import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, SectionHead } from "./Reveal";

export const About = ({ settings }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const title = (settings.about_title || "").split("\n");

  return (
    <section id="tentang" ref={ref} className="bg-white py-28 md:py-36" data-testid="about-section">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 md:px-8 lg:grid-cols-2">
        <Reveal className="relative">
          <div className="absolute -left-6 -top-6 h-40 w-40 rounded-full bg-brand-yellow/60 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] rounded-tr-[6rem] border-8 border-[#F3F7FC] shadow-2xl">
            <motion.img style={{ y, scale: 1.15 }} src={settings.about_image} alt="Tutor mengajar siswa" className="aspect-[4/5] w-full object-cover" data-testid="about-image" />
          </div>
          <div className="absolute -bottom-6 -right-4 rounded-2xl bg-navy px-6 py-5 text-white shadow-2xl md:right-8">
            <p className="font-serif text-3xl">{settings.stats?.[3]?.value || "14"}<span className="text-brand-orange">+</span></p>
            <p className="text-xs text-slate-300">{settings.stats?.[3]?.label || "Tahun Pengalaman"}</p>
          </div>
        </Reveal>

        <div>
          <SectionHead id="about" eyebrow={settings.about_eyebrow} title={title.map((t, i) => <span key={i} className="block">{t}</span>)} desc={settings.about_description} />
          <ol className="mt-12 space-y-0 divide-y divide-slate-200" data-testid="about-points">
            {settings.about_points?.map((pt, i) => (
              <Reveal key={i} delay={0.1 * i} y={20}>
                <li className="group flex gap-6 py-6" data-testid={`about-point-${i}`}>
                  <span className="font-serif text-4xl text-slate-300 transition-colors duration-300 group-hover:text-brand-orange">0{i + 1}</span>
                  <div>
                    <h3 className="text-lg font-bold text-navy">{pt.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600 md:text-base">{pt.desc}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
