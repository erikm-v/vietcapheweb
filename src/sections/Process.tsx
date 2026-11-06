import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { ArrowUpRight, Cherry, Droplets, Flame, PackageOpen, ScanSearch } from "lucide-react";
import { Reveal, SplitText, ease } from "../components/motion";
import { ButtonLink, Mark } from "../components/ui";

const steps = [
  {
    icon: Cherry,
    title: "Selective harvest",
    body: "Only ripe cherries are picked, on farms across Dak Lak and Gia Lai in Vietnam's Central Highlands, where volcanic soil and steady rain suit robusta.",
  },
  {
    icon: Droplets,
    title: "Honey processing",
    body: "The skin comes off, but the sticky mucilage stays on while the beans dry. Controlled fermentation builds sweetness, depth and a syrupy body.",
  },
  {
    icon: ScanSearch,
    title: "Sorted to specialty grade",
    body: "Lots are sorted and graded so what reaches your roastery is clean, consistent and specialty grade.",
  },
  {
    icon: PackageOpen,
    title: "A green sample, first",
    body: "Roast it, cup it, run it through your blend. See how it performs on your equipment before you commit.",
  },
  {
    icon: Flame,
    title: "Ongoing supply",
    body: "Settle on the lot that works and we'll keep your roastery supplied, with straight answers on each harvest.",
  },
];

export function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.7", "end 0.6"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section
      id="process"
      className="relative -mt-16 rounded-t-[2.5rem] bg-yellow pb-36 pt-24 sm:-mt-20 sm:rounded-t-[3.5rem] sm:pb-44 sm:pt-32"
    >
      <div className="mx-auto grid max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2 className="font-display text-[clamp(2.6rem,5.4vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
            <SplitText text="From the highlands to your" />{" "}
            <motion.span
              initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring", bounce: 0.45, duration: 0.9 }}
              className="inline-block"
            >
              <Mark className="bg-ink text-yellow">hopper.</Mark>
            </motion.span>
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/75">
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
          <div className="absolute bottom-8 left-7 top-2 w-0.5 bg-ink/15" />
          <motion.div style={{ scaleY: progress }} className="absolute bottom-8 left-7 top-2 w-0.5 origin-top bg-ink" />
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.8, ease }}
              className="relative flex gap-5 pb-10 last:pb-0 sm:gap-8"
            >
              <div className="relative z-10 grid size-14 shrink-0 place-items-center rounded-full bg-ink text-yellow">
                <s.icon className="size-6" strokeWidth={2} />
              </div>
              <div className="flex-1 rounded-[1.75rem] bg-paper p-6 transition-transform duration-500 hover:-translate-y-1 sm:p-7">
                <p className="font-display text-sm font-bold text-orange">Step {i + 1}</p>
                <h3 className="mt-1 font-display text-2xl font-bold tracking-tight">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-ink/70">{s.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
