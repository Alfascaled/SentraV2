import { useState } from "react";
import { MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Reveal, SectionHead } from "./Reveal";
import { api, formatApiError, waLink } from "@/lib/api";

const LEVELS = ["SD", "SMP", "SMA", "UTBK", "Bahasa Asing", "Lainnya"];
const inputCls = "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-slate-400 outline-none transition-[border-color,box-shadow] duration-300 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/40";

export const Register = ({ settings, programs = [], packages = [] }) => {
  const [form, setForm] = useState({ name: "", phone: "", level: "", program: "", package: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/registrations", form);
      setDone(true);
      toast.success("Pendaftaran terkirim! Tim kami akan menghubungi Anda.");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const waMsg = `Halo Sentra Cendekia, saya ${form.name || "(nama)"} ingin mendaftar les privat ${form.level ? `jenjang ${form.level}` : ""} ${form.program ? `program ${form.program}` : ""} ${form.package ? `paket ${form.package}` : ""}. ${form.message}`.replace(/\s+/g, " ");

  return (
    <section id="daftar" className="noise bg-navy-deep py-28 md:py-36" data-testid="register-section">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHead id="register" light eyebrow="Daftar Sekarang" title="Mulai Perjalanan Belajar Putra-Putri Anda Hari Ini" desc="Isi formulir singkat ini dan konsultan kami akan menghubungi Anda dalam 1x24 jam. Atau langsung chat kami di WhatsApp." />
          <Reveal delay={0.2} className="mt-10">
            <a href={waLink(settings.whatsapp, settings.whatsapp_message)} target="_blank" rel="noreferrer" className="btn-ghost-light" data-testid="register-whatsapp-direct">
              <MessageCircle size={16} className="text-[#25D366]" /> Chat WhatsApp Langsung
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="lg:col-span-7">
          {done ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl" data-testid="register-success">
              <CheckCircle2 size={56} className="mx-auto text-brand-yellow" />
              <h3 className="mt-6 font-serif text-3xl text-white">Terima kasih, {form.name}!</h3>
              <p className="mt-3 text-slate-300">Data Anda sudah kami terima. Ingin respons lebih cepat? Lanjutkan ke WhatsApp.</p>
              <a href={waLink(settings.whatsapp, waMsg)} target="_blank" rel="noreferrer" className="btn-orange mt-8" data-testid="register-success-whatsapp">
                <MessageCircle size={16} /> Lanjut ke WhatsApp
              </a>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-5 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:grid-cols-2 md:p-10" data-testid="register-form">
              <label className="text-sm text-slate-300">Nama Orang Tua / Siswa
                <input required value={form.name} onChange={set("name")} placeholder="Nama lengkap" className={`${inputCls} mt-2`} data-testid="register-name-input" />
              </label>
              <label className="text-sm text-slate-300">Nomor WhatsApp
                <input required value={form.phone} onChange={set("phone")} placeholder="08xxxxxxxxxx" className={`${inputCls} mt-2`} data-testid="register-phone-input" />
              </label>
              <label className="text-sm text-slate-300">Jenjang
                <select value={form.level} onChange={set("level")} className={`${inputCls} mt-2 [&>option]:text-navy`} data-testid="register-level-select">
                  <option value="">Pilih jenjang</option>
                  {LEVELS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </label>
              <label className="text-sm text-slate-300">Program
                <select value={form.program} onChange={set("program")} className={`${inputCls} mt-2 [&>option]:text-navy`} data-testid="register-program-select">
                  <option value="">Pilih program</option>
                  {programs.map((p) => <option key={p.id}>{p.title}</option>)}
                </select>
              </label>
              <label className="text-sm text-slate-300 md:col-span-2">Paket Pertemuan
                <select value={form.package} onChange={set("package")} className={`${inputCls} mt-2 [&>option]:text-navy`} data-testid="register-package-select">
                  <option value="">Pilih paket (opsional)</option>
                  {packages.map((p) => <option key={p.id} value={`${p.name} ${p.sessions}x`}>{p.name} — {p.sessions}x pertemuan</option>)}
                </select>
              </label>
              <label className="text-sm text-slate-300 md:col-span-2">Pesan
                <textarea rows={3} value={form.message} onChange={set("message")} placeholder="Ceritakan kebutuhan belajar anak Anda..." className={`${inputCls} mt-2 resize-none`} data-testid="register-message-input" />
              </label>
              <button disabled={loading} type="submit" className="btn-orange justify-center disabled:opacity-60 md:col-span-2" data-testid="register-submit-button">
                {loading ? "Mengirim..." : <>Kirim Pendaftaran <Send size={16} /></>}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
};
