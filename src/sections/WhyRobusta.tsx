import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { CountUp, Reveal, SplitText } from "../components/motion";
import { Bean } from "../components/ui";

const stats = [
  { value: <CountUp to={2} suffix="×" />, color: "text-orange", body: "Up to twice the caffeine of arabica, for a strong, steady lift." },
  { value: <CountUp to={100} suffix="%" />, color: "text-yellow", body: "Vietnamese robusta, traceable to province and process." },
  { value: "No. 1", color: "text-cream", body: "Vietnam grows more robusta than any other country. The Central Highlands are its heartland." },
];

export function WhyRobusta() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const beanA = useTransform(scrollYProgress, [0, 1], [80, -120]);
  const beanB = useTransform(scrollYProgress, [0, 1], [-40, 100]);
  const spinA = useTransform(scrollYProgress, [0, 1], [10, 70]);
  const spinB = useTransform(scrollYProgress, [0, 1], [-30, -100]);

  return (
    <section ref={ref} className="relative -mt-16 overflow-hidden rounded-t-[2.5rem] bg-ink pb-36 pt-24 text-cream sm:-mt-20 sm:rounded-t-[3.5rem] sm:pb-44 sm:pt-32">
      <motion.div style={{ y: beanA, rotate: spinA }} className="pointer-events-none absolute -right-10 top-24 w-40 sm:w-56">
        <Bean />
      </motion.div>
      <motion.div style={{ y: beanB, rotate: spinB }} className="pointer-events-none absolute -left-8 bottom-40 w-24 sm:w-32">
        <Bean />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <h2 className="font-display text-[clamp(2.6rem,6vw,5.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em]">
          <SplitText text="Robusta," /> <SplitText text="reconsidered." wordClassName="text-orange" delay={0.15} />
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-20">
          <Reveal>
            <p className="font-display text-[clamp(1.8rem,3.6vw,3.2rem)] font-bold leading-[1.05] tracking-tight">
              Selectively harvested. Honey processed. <span className="text-yellow">Specialty grade.</span>
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-cream/70">
              Most robusta is grown for volume. Ours is grown, picked and processed for the cup. Controlled mucilage
              fermentation gives it natural sweetness, cocoa depth and a syrupy body that cuts straight through milk,
              without the harsh, rubbery edge commodity robusta is known for.
            </p>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="border-t-2 border-cream/20 pt-6">
                <p className={`font-display text-7xl font-extrabold tracking-tight sm:text-8xl ${s.color}`}>{s.value}</p>
                <p className="mt-3 max-w-xs text-cream/70">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
