import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  { title: "Kontak & Footer", fields: [
    { name: "whatsapp", label: "Nomor WhatsApp (format 62xxx)", type: "text" },
    { name: "whatsapp_message", label: "Pesan Default WhatsApp", type: "textarea" },
    { name: "email", label: "Email", type: "text" },
    { name: "instagram", label: "Instagram", type: "text" },
    { name: "address", label: "Alamat", type: "text" },
    { name: "footer_text", label: "Teks Footer", type: "textarea" },
  ] },
];

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
