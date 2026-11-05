import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { ArrowUpRight, Cherry, Droplets, Flame, PackageOpen, ScanSearch } from "lucide-react";
import { Reveal, SplitText, ease } from "../components/motion";
import { ButtonLink, Eyebrow } from "../components/ui";

const steps = [
  {
    icon: Cherry,
    title: "Selective harvest",
    body: "Only ripe cherries are picked, on farms across Dak Lak and Gia Lai in Vietnam's Central Highlands, where volcanic soil and steady rain suit robusta.",
    color: "text-rose",
  },
  {
    icon: Droplets,
    title: "Honey processing",
    body: "The skin comes off, but the sticky mucilage stays on while the beans dry. Controlled fermentation builds sweetness, depth and a syrupy body.",
    color: "text-amber",
  },
  {
    icon: ScanSearch,
    title: "Sorted to specialty grade",
    body: "Lots are sorted and graded so what reaches your roastery is clean, consistent and specialty grade.",
    color: "text-leaf",
  },
  {
    icon: PackageOpen,
    title: "A green sample, first",
    body: "Roast it, cup it, run it through your blend. See how it performs on your equipment before you commit.",
    color: "text-orange",
  },
  {
    icon: Flame,
    title: "Ongoing supply",
    body: "Settle on the lot that works and we'll keep your roastery supplied, with straight answers on each harvest.",
    color: "text-rose",
  },
];

export function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.7", "end 0.6"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="process" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <Eyebrow>From cherry to roaster</Eyebrow>
          </Reveal>
          <h2 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.6rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">
            <SplitText text="From the highlands" /> <SplitText text="to your hopper." wordClassName="text-gradient" delay={0.2} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-cream/60">
              Specialty robusta starts long before the roaster. Here's what goes into every bag of green, and how we
              work with you from the first sample.
            </p>
            <div className="mt-10">
              <ButtonLink href="#contact">
                Start with a sample <ArrowUpRight className="size-4" />
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <ol ref={listRef} className="relative">
          <div className="absolute bottom-8 left-7 top-2 w-px bg-white/10" />
          <motion.div
            style={{ scaleY: progress }}
            className="absolute bottom-8 left-7 top-2 w-px origin-top bg-linear-to-b from-amber via-orange to-rose"
          />
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.8, ease }}
              className="relative flex gap-6 pb-12 last:pb-0 sm:gap-8"
            >
              <div className="relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl border border-white/10 bg-ink-3 shadow-lg shadow-black/40">
                <s.icon className={`size-6 ${s.color}`} strokeWidth={1.75} />
              </div>
              <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors duration-500 hover:border-white/15 hover:bg-white/[0.04] sm:p-7">
                <p className="font-mono text-xs text-cream/35">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-cream/60">{s.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
