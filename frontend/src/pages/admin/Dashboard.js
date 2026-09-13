import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, Package, HelpCircle, Inbox, Bell } from "lucide-react";
import { api } from "@/lib/api";

const CARDS = [
  { key: "programs", label: "Program", icon: BookOpen, to: "/admin/content/programs" },
  { key: "tutors", label: "Pengajar", icon: Users, to: "/admin/content/tutors" },
  { key: "packages", label: "Paket", icon: Package, to: "/admin/content/packages" },
  { key: "faqs", label: "FAQ", icon: HelpCircle, to: "/admin/content/faqs" },
  { key: "registrations", label: "Pendaftaran", icon: Inbox, to: "/admin/registrations" },
  { key: "registrations_baru", label: "Pendaftar Baru", icon: Bell, to: "/admin/registrations", accent: true },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get("/admin/summary").then((r) => setData(r.data)); }, []);

  return (
    <div data-testid="admin-dashboard">
      <p className="eyebrow text-brand-orange">Ringkasan</p>
      <h1 className="mt-2 font-serif text-3xl text-navy md:text-4xl">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-500">Kelola seluruh konten website tanpa menyentuh kode.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map(({ key, label, icon: Icon, to, accent }) => (
          <Link key={key} to={to} className={`group rounded-2xl border p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lg ${accent ? "border-brand-orange bg-brand-orange text-white" : "border-slate-200 bg-white"}`} data-testid={`dashboard-card-${key}`}>
            <div className="flex items-center justify-between">
              <span className={`grid h-11 w-11 place-items-center rounded-xl ${accent ? "bg-white/20" : "bg-sky/15 text-navy"}`}><Icon size={20} /></span>
              <span className={`text-xs font-semibold ${accent ? "text-white/80" : "text-slate-400"}`}>Kelola →</span>
            </div>
            <p className={`mt-5 font-serif text-4xl ${accent ? "text-white" : "text-navy"}`}>{data ? data.counts[key] : "–"}</p>
            <p className={`mt-1 text-sm ${accent ? "text-white/90" : "text-slate-500"}`}>{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="font-serif text-xl text-navy">Pendaftaran Terbaru</h2>
        <div className="mt-4 divide-y divide-slate-100">
          {data?.latest_registrations?.length === 0 && <p className="py-6 text-sm text-slate-500">Belum ada pendaftaran.</p>}
          {data?.latest_registrations?.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm" data-testid="dashboard-latest-registration">
              <div><p className="font-semibold text-navy">{r.name}</p><p className="text-xs text-slate-500">{r.phone} · {r.level || "-"} · {r.program || "-"}</p></div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${r.status === "baru" ? "bg-brand-yellow text-navy" : "bg-slate-100 text-slate-600"}`}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
