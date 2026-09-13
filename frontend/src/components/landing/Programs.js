import { ArrowUpRight, BookOpen, School, GraduationCap, Globe, Calculator, FlaskConical, PenTool, Star } from "lucide-react";
import { Reveal, SectionHead } from "./Reveal";
import { scrollToId } from "@/hooks/useLenis";

export const ICONS = { book: BookOpen, school: School, graduation: GraduationCap, globe: Globe, calculator: Calculator, flask: FlaskConical, pen: PenTool, star: Star };
const SPANS = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-4", "lg:col-span-2"];

export const Programs = ({ programs = [] }) => (
  <section id="program" className="bg-[#F3F7FC] py-28 md:py-36" data-testid="programs-section">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHead id="programs" eyebrow="Program Unggulan" title="Sistem Kurikulum Komprehensif untuk Seluruh Jenjang" desc="Kami menyediakan program pendampingan belajar yang dirancang sesuai kebutuhan dan tahapan perkembangan setiap siswa." />
        <Reveal delay={0.2}>
          <button onClick={() => scrollToId("paket")} className="group inline-flex items-center gap-2 text-sm font-bold text-navy" data-testid="programs-see-packages">
            Lihat paket harga
            <span className="grid h-9 w-9 place-items-center rounded-full bg-navy text-white transition-transform duration-300 group-hover:rotate-45"><ArrowUpRight size={16} /></span>
          </button>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-5 lg:grid-cols-6" data-testid="programs-grid">
        {programs.map((p, i) => {
          const Icon = ICONS[p.icon] || BookOpen;
          const big = i % 4 === 2;
          return (
            <Reveal key={p.id} delay={i * 0.1} className={SPANS[i % 4]}>
              <article className={`group relative h-full overflow-hidden rounded-3xl border p-8 transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(23,43,77,0.4)] md:p-10 ${big ? "border-navy bg-navy text-white" : "border-sky/30 bg-sky/10 text-navy"}`} data-testid={`program-card-${i}`}>
                <div className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150 ${big ? "bg-brand-orange/40" : "bg-sky/40"}`} />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <span className={`grid h-14 w-14 place-items-center rounded-2xl ${big ? "bg-white/10 text-brand-yellow" : "bg-white text-brand-orange shadow-sm"}`}><Icon size={26} strokeWidth={1.8} /></span>
                    <span className={`eyebrow ${big ? "text-brand-yellow" : "text-brand-orange"}`}>0{i + 1}</span>
                  </div>
                  <h3 className="mt-8 font-serif text-2xl leading-tight md:text-3xl">{p.title}</h3>
                  <p className={`mt-4 text-sm leading-relaxed md:text-base ${big ? "text-slate-300" : "text-slate-600"}`}>{p.description}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-8">
                    {p.subjects?.map((s) => (
                      <span key={s} className={`rounded-full px-3 py-1 text-xs font-semibold ${big ? "bg-white/10 text-white" : "bg-white text-navy"}`}>{s}</span>
                    ))}
                  </div>
                  <span className={`mt-6 inline-block w-fit rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${big ? "bg-brand-orange text-white" : "bg-navy text-white"}`}>{p.level}</span>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);
