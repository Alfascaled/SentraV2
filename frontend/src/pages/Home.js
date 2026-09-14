import { useLenis } from "@/hooks/useLenis";
import { useSiteContent } from "@/hooks/useSiteContent";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Programs } from "@/components/landing/Programs";
import { About } from "@/components/landing/About";
import { Tutors } from "@/components/landing/Tutors";
import { Packages } from "@/components/landing/Packages";
import { FAQ } from "@/components/landing/FAQ";
import { Register } from "@/components/landing/Register";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  const { data, loading, error } = useSiteContent();
  useLenis();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-navy-deep" data-testid="home-loading">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
      </div>
    );
  }
  if (error) {
    return <div className="grid min-h-screen place-items-center bg-navy-deep text-white" data-testid="home-error">Gagal memuat konten. Coba muat ulang halaman.</div>;
  }

  const { settings, programs, tutors, packages, faqs } = data;
  return (
    <div className="bg-navy-deep font-sans" data-testid="home-page">
      <Navbar settings={settings} />
      <Hero settings={settings} />
      <Stats stats={settings.stats} />
      <Programs programs={programs} />
      <About settings={settings} />
      <Tutors tutors={tutors} />
      <Packages packages={packages} settings={settings} />
      <FAQ faqs={faqs} />
      <Register settings={settings} programs={programs} packages={packages} />
      <Footer settings={settings} />
    </div>
  );
}
