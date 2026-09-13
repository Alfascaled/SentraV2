import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import { scrollToId } from "@/hooks/useLenis";
import { waLink } from "@/lib/api";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "program", label: "Program" },
  { id: "tentang", label: "Tentang Kami" },
  { id: "pengajar", label: "Pengajar" },
  { id: "paket", label: "Paket" },
  { id: "faq", label: "FAQ" },
];

export const Navbar = ({ settings }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => { setOpen(false); scrollToId(id); };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ${
        scrolled ? "bg-white/90 backdrop-blur-xl shadow-[0_10px_40px_-20px_rgba(23,43,77,0.35)] border-b border-navy/10" : "bg-white/80 backdrop-blur-md border-b border-navy/5"
      }`}
      data-testid="navbar"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <button onClick={() => go("home")} className="flex items-center gap-3" data-testid="nav-logo">
          <img src={settings.logo_url} alt={settings.brand_name} className="-my-8 h-28 w-auto object-contain" />
        </button>

        <nav className="hidden items-center gap-1 lg:flex" data-testid="nav-links">
          {LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              className="group relative rounded-full px-4 py-2 text-sm font-semibold text-navy/80 transition-colors duration-300 hover:text-navy"
              data-testid={`nav-link-${l.id}`}
            >
              {l.label}
              <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-brand-orange transition-transform duration-300 group-hover:scale-x-100" />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={waLink(settings.whatsapp, settings.whatsapp_message)} target="_blank" rel="noreferrer" className="btn-orange hidden !px-5 !py-2.5 sm:inline-flex" data-testid="nav-cta-whatsapp">
            <MessageCircle size={16} /> Hubungi Kami
          </a>
          <button className="rounded-full border border-navy/15 p-2 text-navy lg:hidden" onClick={() => setOpen(!open)} data-testid="nav-mobile-toggle">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-navy/10 bg-white/95 backdrop-blur-xl lg:hidden"
            data-testid="nav-mobile-menu"
          >
            <div className="flex flex-col px-5 py-4">
              {LINKS.map((l) => (
                <button key={l.id} onClick={() => go(l.id)} className="py-3 text-left text-base font-medium text-navy hover:text-brand-orange" data-testid={`nav-mobile-link-${l.id}`}>
                  {l.label}
                </button>
              ))}
              <a href={waLink(settings.whatsapp, settings.whatsapp_message)} target="_blank" rel="noreferrer" className="btn-orange mt-3 justify-center">
                <MessageCircle size={16} /> Hubungi Kami
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
