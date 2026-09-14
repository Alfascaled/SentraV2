import { useState, useEffect } from "react";
import { KeyRound, Eye, EyeOff, ShieldCheck, MessageCircle, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, formatApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const PwInput = ({ id, label, value, onChange, testId }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</Label>
      <div className="relative">
        <Input id={id} type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} className="pr-10" data-testid={testId} />
        <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy" tabIndex={-1}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
};

export default function AccountPage() {
  const { user } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [wa, setWa] = useState("");
  const [waSaving, setWaSaving] = useState(false);

  useEffect(() => { api.get("/admin/whatsapp").then((r) => setWa(r.data.admin_whatsapp || "")).catch(() => {}); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (next.length < 6) return toast.error("Password baru minimal 6 karakter");
    if (next !== confirm) return toast.error("Konfirmasi password tidak cocok");
    setSaving(true);
    try {
      await api.post("/auth/change-password", { current_password: current, new_password: next });
      toast.success("Password berhasil diperbarui");
      setCurrent(""); setNext(""); setConfirm("");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const saveWa = async (e) => {
    e.preventDefault();
    const digits = wa.replace(/\D/g, "");
    if (digits.length < 8) return toast.error("Masukkan nomor WhatsApp yang valid (format 62xxxxxxxxxx)");
    setWaSaving(true);
    try {
      const { data } = await api.put("/admin/whatsapp", { admin_whatsapp: digits });
      setWa(data.admin_whatsapp);
      toast.success("Nomor WhatsApp admin tersimpan");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setWaSaving(false);
    }
  };

  return (
    <div data-testid="account-page">
      <p className="eyebrow text-brand-orange">Akun</p>
      <h1 className="mt-2 font-serif text-3xl text-navy md:text-4xl">Keamanan Akun</h1>
      <p className="mt-2 text-sm text-slate-500">Masuk sebagai <span className="font-semibold text-navy">{user?.email}</span></p>

      <div className="mt-8 grid max-w-4xl gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-sky/15 text-navy"><KeyRound size={20} /></span>
            <div>
              <h2 className="font-serif text-xl text-navy">Ganti Password</h2>
              <p className="text-xs text-slate-500">Gunakan password yang kuat dan unik.</p>
            </div>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <PwInput id="current-pw" label="Password Saat Ini" value={current} onChange={setCurrent} testId="account-current-password" />
            <PwInput id="new-pw" label="Password Baru (min. 6 karakter)" value={next} onChange={setNext} testId="account-new-password" />
            <PwInput id="confirm-pw" label="Ulangi Password Baru" value={confirm} onChange={setConfirm} testId="account-confirm-password" />
            <Button type="submit" disabled={saving || !current || !next || !confirm} className="w-full rounded-full bg-navy hover:bg-navy/90" data-testid="account-save-button">
              <ShieldCheck size={16} className="mr-2" /> {saving ? "Menyimpan..." : "Perbarui Password"}
            </Button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6" data-testid="account-whatsapp-card">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><MessageCircle size={20} /></span>
            <div>
              <h2 className="font-serif text-xl text-navy">Nomor WhatsApp Admin</h2>
              <p className="text-xs text-slate-500">Nomor tujuan notifikasi pendaftaran baru.</p>
            </div>
          </div>
          <form onSubmit={saveWa} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-wa" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Nomor WhatsApp (format 62xxxxxxxxxx)</Label>
              <Input id="admin-wa" value={wa} onChange={(e) => setWa(e.target.value)} placeholder="6281234567890" data-testid="account-whatsapp-input" />
              <p className="text-xs text-slate-400">Contoh: 6281234567890 (tanpa tanda + atau spasi).</p>
            </div>
            <Button type="submit" disabled={waSaving || !wa} className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700" data-testid="account-whatsapp-save-button">
              <Save size={16} className="mr-2" /> {waSaving ? "Menyimpan..." : "Simpan Nomor"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
