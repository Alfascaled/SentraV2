import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal, SectionHead } from "./Reveal";

export const FAQ = ({ faqs = [] }) => (
  <section id="faq" className="bg-white py-28 md:py-36" data-testid="faq-section">
    <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <SectionHead id="faq" eyebrow="FAQ" title="Pertanyaan yang Sering Diajukan" desc="Masih ada pertanyaan lain? Tim kami siap membantu Anda melalui WhatsApp setiap hari pukul 08.00–21.00 WIB." />
      </div>
      <Reveal delay={0.15} className="lg:col-span-7">
        <Accordion type="single" collapsible className="divide-y divide-slate-200 border-y border-slate-200" data-testid="faq-accordion">
          {faqs.map((f, i) => (
            <AccordionItem key={f.id} value={f.id} className="border-0" data-testid={`faq-item-${i}`}>
              <AccordionTrigger className="py-6 text-left font-sans text-base font-bold text-navy hover:no-underline hover:text-brand-orange md:text-lg [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-brand-orange" data-testid={`faq-trigger-${i}`}>
                <span className="flex gap-5"><span className="font-serif text-slate-300">0{i + 1}</span>{f.question}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 pl-12 text-sm leading-relaxed text-slate-600 md:text-base">{f.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </div>
  </section>
);
