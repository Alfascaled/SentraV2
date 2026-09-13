export const Marquee = ({ text, dark = true }) => {
  const items = (text || "").split("•").map((t) => t.trim()).filter(Boolean);
  const row = [...items, ...items];
  return (
    <div className={`overflow-hidden border-y py-6 ${dark ? "border-white/10 bg-navy-deep" : "border-navy/10 bg-white"}`} data-testid="marquee">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {[...row, ...row].map((t, i) => (
          <span key={i} className={`flex items-center gap-10 font-serif text-2xl italic md:text-3xl ${dark ? "text-white/70" : "text-navy/70"}`}>
            {t}
            <span className="h-2 w-2 rounded-full bg-brand-orange" />
          </span>
        ))}
      </div>
    </div>
  );
};
