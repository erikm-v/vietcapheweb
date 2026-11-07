import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { FarmersScene } from "../components/FarmersScene";
import { ButtonLink, Mark } from "../components/ui";
import { Magnetic, SplitText, ease } from "../components/motion";

function Intro() {
  return (
    <>
      <p className="max-w-md text-lg leading-relaxed text-ink/80 sm:text-xl">
        Honey-processed, specialty-grade robusta from Cu M'gar, Dak Lak. We supply it green (unroasted), only to
        roasters across Australia.
      </p>
      <div className="mt-9 flex flex-wrap items-center gap-3">
        <Magnetic>
          <ButtonLink href="#contact">
            Request a green sample <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </ButtonLink>
        </Magnetic>
        <ButtonLink href="#story" variant="outline">
          I'm a past customer
        </ButtonLink>
      </div>
    </>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <>
      <section id="top" ref={ref} className="relative h-[170vh] bg-orange lg:h-[185vh]">
        <div className="sticky top-0 h-svh overflow-hidden">
          <FarmersScene progress={progress} className="absolute inset-0 size-full" />

          <motion.div
            style={{ y: textY }}
            className="relative mx-auto flex h-full max-w-7xl flex-col px-5 pt-28 sm:px-8 lg:justify-center lg:pt-10"
          >
            <div className="lg:max-w-[52%]">
              <motion.a
                href="#story"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease }}
                className="group inline-flex items-center gap-2 text-sm font-semibold underline decoration-ink/30 decoration-2 underline-offset-4 transition hover:decoration-ink sm:text-base"
              >
                VietCaPhe has gone wholesale. Read our note
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </motion.a>

              <h1 className="mt-6 font-display text-[clamp(2.9rem,5.4vw,5.5rem)] font-extrabold leading-[0.9] tracking-[-0.04em]">
                <SplitText text="Green specialty robusta" delay={0.4} className="block" />
                <span className="mt-2 block">
                  <SplitText text="for" delay={0.6} />{" "}
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.85, type: "spring", bounce: 0.45, duration: 0.9 }}
                    className="inline-block"
                  >
                    <Mark>roasters.</Mark>
                  </motion.span>
                </span>
              </h1>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8, ease }}
                className="mt-7 hidden lg:block"
              >
                <Intro />
              </motion.div>
            </div>

            <motion.div
              style={{ opacity: cueOpacity }}
              className="absolute bottom-7 left-5 flex items-center gap-3 text-sm font-semibold sm:left-8"
            >
              <motion.span
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="grid size-9 place-items-center rounded-full bg-ink text-orange"
              >
                <ArrowDown className="size-4" />
              </motion.span>
              Scroll to toss the beans
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="bg-orange px-5 pb-16 pt-4 sm:px-8 lg:hidden">
        <Intro />
      </div>
    </>
  );
}
