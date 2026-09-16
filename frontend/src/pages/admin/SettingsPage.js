import { useEffect, useState, useMemo } from "react";
import { Plus, Trash2, Save, MessageCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api, formatApiError } from "@/lib/api";
import { FieldInput } from "./FieldInput";

const GROUPS = [
  { title: "Identitas", fields: [
    { name: "brand_name", label: "Nama Lembaga", type: "text" },
    { name: "tagline", label: "Tagline", type: "text" },
    { name: "logo_url", label: "URL Logo", type: "image" },
  ] },
  { title: "Hero (Bagian Atas)", fields: [
    { name: "hero_badge", label: "Teks Badge", type: "text" },
    { name: "hero_title", label: "Judul Utama (1 baris = 1 baris tampil)", type: "textarea" },
    { name: "hero_subtitle", label: "Sub Judul", type: "textarea" },
    { name: "hero_cta", label: "Teks Tombol", type: "text" },
    { name: "hero_image", label: "URL Gambar Hero", type: "image" },
  ] },
  { title: "Tentang Kami", fields: [
    { name: "about_eyebrow", label: "Label Kecil", type: "text" },
    { name: "about_title", label: "Judul (1 baris = 1 baris tampil)", type: "textarea" },
    { name: "about_description", label: "Deskripsi", type: "textarea" },
    { name: "about_image", label: "URL Gambar", type: "image" },
  ] },
  { title: "Kontak", fields: [
    { name: "whatsapp", label: "Nomor WhatsApp (format 62xxx)", type: "text" },
    { name: "whatsapp_message", label: "Pesan Default WhatsApp", type: "textarea" },
    { name: "email", label: "Email", type: "text" },
    { name: "instagram", label: "Instagram", type: "text" },
    { name: "address", label: "Alamat", type: "text" },
  ] },
  { title: "Footer", fields: [
    { name: "footer_text", label: "Deskripsi Footer", type: "textarea" },
    { name: "footer_copyright", label: "Teks Hak Cipta (setelah © tahun & nama lembaga)", type: "text" },
  ] },
];

const WA_PLACEHOLDERS = [
  { tag: "{nama}", desc: "Nama pendaftar" },
  { tag: "{program}", desc: "Program yang dipilih" },
  { tag: "{paket}", desc: "Paket yang dipilih" },
  { tag: "{jenjang}", desc: "Jenjang pendidikan" },
  { tag: "{program_clause}", desc: 'Otomatis " untuk program X" (kosong jika tidak ada)' },
  { tag: "{paket_clause}", desc: 'Otomatis " (paket X)" (kosong jika tidak ada)' },
];

function buildPreview(template) {
  if (!template) return "";
  return template
    .replace(/\{nama\}/g, "Budi Santoso")
    .replace(/\{program\}/g, "Les Privat SMA & UTBK")
    .replace(/\{paket\}/g, "Paket Intensif")
    .replace(/\{jenjang\}/g, "Jenjang SMA")
    .replace(/\{program_clause\}/g, " untuk program Les Privat SMA & UTBK")
    .replace(/\{paket_clause\}/g, " (paket Paket Intensif)");
}

const Card = ({ title, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-6">
    <h2 className="font-serif text-xl text-navy">{title}</h2>
    <div className="mt-5 grid gap-4">{children}</div>
  </section>
);

export default function SettingsPage() {
  const [s, setS] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { api.get("/settings").then((r) => setS(r.data)); }, []);
  if (!s) return <p className="text-sm text-slate-500">Memuat...</p>;

  const set = (k, v) => setS({ ...s, [k]: v });
  const setListItem = (k, i, key, v) => set(k, s[k].map((it, idx) => (idx === i ? { ...it, [key]: v } : it)));
  const removeItem = (k, i) => set(k, s[k].filter((_, idx) => idx !== i));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put("/settings", s);
      setS(data);
      toast.success("Pengaturan tersimpan");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} data-testid="settings-page">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-brand-orange">Konten</p>
          <h1 className="mt-2 font-serif text-3xl text-navy md:text-4xl">Pengaturan Situs</h1>
        </div>
        <Button type="submit" disabled={saving} className="rounded-full bg-brand-orange hover:bg-[#ff7a26]" data-testid="settings-save-button"><Save size={16} className="mr-1" /> {saving ? "Menyimpan..." : "Simpan Semua"}</Button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {GROUPS.map((g) => (
          <Card key={g.title} title={g.title}>
            {g.fields.map((f) => <FieldInput key={f.name} field={f} value={s[f.name]} onChange={(v) => set(f.name, v)} testId={`settings-${f.name}`} />)}
          </Card>
        ))}

        <Card title="Statistik (Angka Pencapaian)">
          {s.stats.map((st, i) => (
            <div key={i} className="flex gap-2" data-testid={`settings-stat-${i}`}>
              <Input value={st.value} onChange={(e) => setListItem("stats", i, "value", e.target.value)} placeholder="Angka" className="w-32" data-testid={`settings-stat-value-${i}`} />
              <Input value={st.label} onChange={(e) => setListItem("stats", i, "label", e.target.value)} placeholder="Label" data-testid={`settings-stat-label-${i}`} />
              <Button type="button" variant="ghost" size="icon" className="text-red-600" onClick={() => removeItem("stats", i)}><Trash2 size={16} /></Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => set("stats", [...s.stats, { value: "", label: "" }])} data-testid="settings-add-stat"><Plus size={14} className="mr-1" /> Tambah Statistik</Button>
        </Card>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2" data-testid="settings-wa-template-card">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-[#25D366]" />
            <h2 className="font-serif text-xl text-navy">Template Pesan WhatsApp Balasan</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">Pesan ini digunakan saat admin menekan tombol "Balas" di halaman Pendaftaran.</p>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Template Pesan</label>
              <Textarea
                value={s.wa_reply_template || ""}
                onChange={(e) => set("wa_reply_template", e.target.value)}
                rows={5}
                placeholder="Tulis pesan template..."
                className="resize-y text-sm"
                data-testid="settings-wa-template-input"
              />
              <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <Info size={13} /> Placeholder yang tersedia
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {WA_PLACEHOLDERS.map((p) => (
                    <button key={p.tag} type="button" onClick={() => set("wa_reply_template", (s.wa_reply_template || "") + p.tag)} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-mono text-slate-700 transition hover:border-brand-orange hover:text-brand-orange" title={p.desc} data-testid={`wa-placeholder-${p.tag.replace(/[{}]/g, "")}`}>
                      {p.tag} <span className="text-[10px] font-sans text-slate-400">({p.desc})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Preview Pesan</label>
              <div className="rounded-xl border border-[#25D366]/30 bg-[#dcf8c6] p-4 text-sm leading-relaxed text-slate-800 shadow-sm" data-testid="settings-wa-template-preview">
                {buildPreview(s.wa_reply_template) || <span className="italic text-slate-400">Tulis template di samping untuk melihat preview...</span>}
              </div>
              <p className="mt-2 text-xs text-slate-400">Preview menggunakan data contoh: Budi Santoso, Les Privat SMA & UTBK, Paket Intensif.</p>
            </div>
          </div>
        </section>

        <Card title="Poin Keunggulan (Tentang Kami)">
          {s.about_points.map((pt, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-3" data-testid={`settings-point-${i}`}>
              <div className="flex gap-2">
                <Input value={pt.title} onChange={(e) => setListItem("about_points", i, "title", e.target.value)} placeholder="Judul poin" data-testid={`settings-point-title-${i}`} />
                <Button type="button" variant="ghost" size="icon" className="text-red-600" onClick={() => removeItem("about_points", i)}><Trash2 size={16} /></Button>
              </div>
              <Input value={pt.desc} onChange={(e) => setListItem("about_points", i, "desc", e.target.value)} placeholder="Deskripsi" className="mt-2" data-testid={`settings-point-desc-${i}`} />
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => set("about_points", [...s.about_points, { title: "", desc: "" }])} data-testid="settings-add-point"><Plus size={14} className="mr-1" /> Tambah Poin</Button>
        </Card>
      </div>
    </form>
  );
}
