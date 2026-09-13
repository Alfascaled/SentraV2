import { Check, Sparkles } from "lucide-react";
import { Reveal, SectionHead } from "./Reveal";
import { formatRupiah, waLink } from "@/lib/api";

export const Packages = ({ packages = [], settings }) => (
  <section id="paket" className="bg-[#F3F7FC] py-28 md:py-36" data-testid="packages-section">
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <SectionHead id="packages" eyebrow="Paket Pertemuan" title="Pilih Paket yang Paling Sesuai Kebutuhan Belajar" desc="Semakin banyak pertemuan, semakin hemat. Semua paket sudah termasuk tutor datang ke rumah dan konsultasi gratis." align="center" />
      <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4" data-testid="packages-grid">
        {packages.map((p, i) => {
          const msg = `Halo Sentra Cendekia, saya tertarik dengan ${p.name} (${p.sessions}x pertemuan).`;
          return (
            <Reveal key={p.id} delay={i * 0.1} className={p.popular ? "xl:-mt-6" : ""}>
              <article className={`relative flex h-full flex-col rounded-3xl border p-8 transition-[transform,box-shadow] duration-500 hover:-translate-y-2 hover:shadow-[0_35px_70px_-30px_rgba(23,43,77,0.45)] ${p.popular ? "border-navy bg-navy text-white shadow-2xl" : "border-slate-200 bg-white text-navy"}`} data-testid={`package-card-${i}`}>
                {p.popular && (
                  <span className="absolute -top-4 left-8 inline-flex items-center gap-1 rounded-full bg-brand-yellow px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-navy" data-testid={`package-popular-badge-${i}`}>
                    <Sparkles size={12} /> Terpopuler
                  </span>
                )}
                <p className={`eyebrow ${p.popular ? "text-brand-yellow" : "text-brand-orange"}`}>{p.name}</p>
                <div className="mt-5 flex items-end gap-2">
                  <span className="font-serif text-6xl leading-none">{p.sessions}</span>
                  <span className={`pb-1 text-sm font-semibold ${p.popular ? "text-slate-300" : "text-slate-500"}`}>x pertemuan<br />{p.duration}</span>
                </div>
                <p className={`mt-6 font-serif text-2xl ${p.popular ? "text-white" : "text-navy"}`} data-testid={`package-price-${i}`}>{formatRupiah(p.price)}</p>
                <p className={`mt-1 text-xs ${p.popular ? "text-slate-400" : "text-slate-500"}`}>{formatRupiah(Math.round(p.price / (p.sessions || 1)))} / pertemuan</p>
                <p className={`mt-4 text-sm ${p.popular ? "text-slate-300" : "text-slate-600"}`}>{p.description}</p>
                <ul className="mt-7 space-y-3 text-sm">
                  {p.features?.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${p.popular ? "bg-brand-yellow text-navy" : "bg-sky/20 text-navy"}`}><Check size={12} strokeWidth={3} /></span>
                      <span className={p.popular ? "text-slate-200" : "text-slate-700"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href={waLink(settings.whatsapp, msg)} target="_blank" rel="noreferrer" className={`mt-auto pt-8 ${p.popular ? "" : ""}`} data-testid={`package-cta-${i}`}>
                  <span className={`btn-pill w-full justify-center ${p.popular ? "bg-brand-orange text-white hover:-translate-y-0.5 hover:bg-[#ff7a26]" : "border border-navy text-navy hover:-translate-y-0.5 hover:bg-navy hover:text-white"}`}>Pilih Paket Ini</span>
                </a>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);
