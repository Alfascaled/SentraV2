import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Settings, BookOpen, Users, Package, HelpCircle, Inbox, LogOut, ExternalLink, KeyRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/settings", label: "Pengaturan Situs", icon: Settings },
  { to: "/admin/content/programs", label: "Program", icon: BookOpen },
  { to: "/admin/content/tutors", label: "Pengajar", icon: Users },
  { to: "/admin/content/packages", label: "Paket", icon: Package },
  { to: "/admin/content/faqs", label: "FAQ", icon: HelpCircle },
  { to: "/admin/registrations", label: "Pendaftaran", icon: Inbox },
  { to: "/admin/account", label: "Akun & WhatsApp", icon: KeyRound },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const onLogout = async () => { await logout(); navigate("/admin/login"); };

  return (
    <div className="flex min-h-screen bg-white font-sans text-slate-800" data-testid="admin-layout">
      <aside className="hidden w-64 shrink-0 flex-col bg-navy text-white md:flex" data-testid="admin-sidebar">
        <div className="px-6 py-7">
          <p className="font-serif text-2xl leading-none">Sentra <span className="text-gold">Cendekia</span></p>
          <p className="eyebrow mt-2 text-slate-400">Admin Panel</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${isActive ? "bg-brand-orange text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"}`} data-testid={`admin-nav-${label.toLowerCase().replace(/\s/g, "-")}`}>
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <p className="truncate px-2 text-xs text-slate-400" data-testid="admin-user-email">{user?.email}</p>
          <a href="/" target="_blank" rel="noreferrer" className="mt-3 flex items-center gap-2 px-2 text-sm text-slate-300 hover:text-white"><ExternalLink size={16} /> Lihat Website</a>
          <button onClick={onLogout} className="mt-2 flex items-center gap-2 px-2 text-sm text-slate-300 hover:text-brand-yellow" data-testid="admin-logout-button"><LogOut size={16} /> Keluar</button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          {NAV.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${isActive ? "bg-navy text-white" : "bg-slate-100 text-slate-600"}`}>{label}</NavLink>
          ))}
          <button onClick={onLogout} className="whitespace-nowrap rounded-full bg-brand-orange px-3 py-1.5 text-xs font-semibold text-white">Keluar</button>
        </header>
        <main className="flex-1 p-5 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
