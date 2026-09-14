import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import { scrollToId } from "@/hooks/useLenis";
import { waLink } from "@/lib/api";

export const Footer = ({ settings }) => (
  <footer className="border-t border-white/10 bg-navy-deep text-slate-300" data-testid="footer">
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-12 md:px-8">
      <div className="md:col-span-5">
        <img src={settings.logo_url} alt={settings.brand_name} className="-my-6 -ml-4 h-32 w-auto" />
        <p className="mt-5 max-w-sm text-sm leading-relaxed">{settings.footer_text}</p>
        <p className="mt-4 font-serif italic text-brand-yellow">“{settings.tagline}”</p>
      </div>
      <div className="md:col-span-3">
        <p className="eyebrow text-brand-orange">Navigasi</p>
        <ul className="mt-5 space-y-3 text-sm">
          {[["program", "Program"], ["tentang", "Tentang Kami"], ["pengajar", "Pengajar"], ["paket", "Paket"], ["faq", "FAQ"]].map(([id, label]) => (
            <li key={id}><button onClick={() => scrollToId(id)} className="transition-colors duration-300 hover:text-white" data-testid={`footer-link-${id}`}>{label}</button></li>
          ))}
        </ul>
      </div>
      <div className="md:col-span-4">
        <p className="eyebrow text-brand-orange">Kontak</p>
        <ul className="mt-5 space-y-3 text-sm">
          <li><a href={waLink(settings.whatsapp, settings.whatsapp_message)} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-white" data-testid="footer-whatsapp"><MessageCircle size={16} className="text-[#25D366]" /> +{settings.whatsapp}</a></li>
          <li><a href={`mailto:${settings.email}`} className="flex items-center gap-3 hover:text-white"><Mail size={16} className="text-brand-orange" /> {settings.email}</a></li>
          <li className="flex items-center gap-3"><Instagram size={16} className="text-brand-orange" /> {settings.instagram}</li>
          <li className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-brand-orange" /> {settings.address}</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-5 py-6 text-xs text-slate-500 md:flex-row md:items-center md:px-8">
        <p>© {new Date().getFullYear()} {settings.brand_name}. {settings.footer_copyright}</p>
        <a href="/admin/login" className="hover:text-slate-300" data-testid="footer-admin-link">Admin</a>
      </div>
    </div>
  </footer>
);
