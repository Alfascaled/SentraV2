import { GraduationCap, BookOpen } from "lucide-react";
import { Reveal, SectionHead } from "./Reveal";

export const Tutors = ({ tutors = [] }) => (
  <section id="pengajar" className="noise bg-navy py-28 md:py-36" data-testid="tutors-section">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <SectionHead id="tutors" light eyebrow="Pengajar Kami" title="Tutor Pilihan dari Universitas Terbaik" desc="Setiap tutor melewati seleksi akademik dan micro-teaching ketat. Kami hanya menerima yang terbaik untuk anak Anda." />
      <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3" data-testid="tutors-grid">
        {tutors.map((t, i) => (
          <Reveal key={t.id} delay={i * 0.12}>
            <article className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-navy-deep/60" data-testid={`tutor-card-${i}`}>
              <div className="relative aspect-[4/5] overflow-hidden">
                <img src={t.photo} alt={t.name} className="h-full w-full object-cover grayscale transition-[transform,filter] duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/20 to-transparent" />
                <span className="absolute left-5 top-5 rounded-full bg-brand-orange px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">{t.subject}</span>
              </div>
              <div className="relative -mt-16 p-7">
                <h3 className="font-serif text-2xl text-white">{t.name}</h3>
                <p className="mt-2 flex items-center gap-2 text-sm text-brand-yellow"><GraduationCap size={16} /> {t.education}</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">{t.bio}</p>
                <div className="mt-5 h-px w-12 bg-brand-orange transition-[width] duration-500 group-hover:w-full" />
                <p className="mt-3 flex items-center gap-2 text-xs text-slate-400"><BookOpen size={14} /> Tutor privat tersertifikasi</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
