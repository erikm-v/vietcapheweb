import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { Reveal, SplitText, ease } from "../components/motion";
import { site } from "../config";

const faqs = [
  {
    q: "What happened to the VietCaPhe online store?",
    a: `We've moved to wholesale. Instead of selling roasted bags direct, we now supply our specialty robusta green (unroasted) to Australian roasters, so far more people can enjoy it. If you have a question about a past order, email ${site.email}.`,
  },
  {
    q: "Do you sell roasted coffee, or supply cafés?",
    a: "No. We only supply green, unroasted beans to roasters. If you run a café and want our robusta on your menu, ask your roaster to get in touch with us.",
  },
  {
    q: "Where can I still get VietCaPhe coffee to drink at home?",
    a: "We no longer sell retail. As more roasters bring our robusta on, it will turn up in more cafés and roasted bags. If there's a local roaster you'd love to see stock it, point them our way.",
  },
  {
    q: "What does honey processed mean?",
    a: "After picking, the cherry skin is removed but the sticky fruit layer, called mucilage, is left on the bean while it dries. That controlled fermentation adds natural sweetness, depth and a syrupy body. It's a big part of why this robusta tastes nothing like the commodity stuff.",
  },
  {
    q: "Why put robusta in a specialty program?",
    a: "Specialty robusta brings body, crema and cocoa depth that cut through milk, plus up to twice the caffeine of arabica. It works as a blend component, as a single-origin espresso, or as the heart of a Vietnamese coffee menu.",
  },
  {
    q: "Can I get a sample before I commit?",
    a: "Yes. Tell us about your roastery and what you're looking for, and we'll send a green sample for you to roast and cup.",
  },
  {
    q: "How does pricing work?",
    a: "Pricing depends on the lot and the volume. Get in touch with what you're after and we'll send current pricing and availability.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative -mt-16 rounded-t-[2.5rem] bg-cream pb-36 pt-24 sm:-mt-20 sm:rounded-t-[3.5rem] sm:pb-44 sm:pt-32"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <h2 className="font-display text-[clamp(2.6rem,5.4vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
          <SplitText text="Questions," /> <SplitText text="answered." wordClassName="text-orange" delay={0.15} />
        </h2>

        <Reveal>
          <div className="border-t-2 border-ink">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="border-b-2 border-ink">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-display text-xl font-bold tracking-tight sm:text-2xl">{f.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.4, ease }}
                      className={`grid size-11 shrink-0 place-items-center rounded-full transition-colors ${
                        isOpen ? "bg-orange text-ink" : "bg-ink text-cream group-hover:bg-orange group-hover:text-ink"
                      }`}
                    >
                      <Plus className="size-5" strokeWidth={2.5} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-7 pr-14 text-lg leading-relaxed text-ink/70">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
