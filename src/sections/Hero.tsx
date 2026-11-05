import { useRef, type MouseEvent } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Bean, ButtonLink } from "../components/ui";
import { Float, Magnetic, Parallax, SplitText, TextLoop, ease } from "../components/motion";

const loop = ["roastery.", "espresso.", "milk menu.", "next blend.", "cupping table."];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const mx = useSpring(0, { stiffness: 50, damping: 18 });
  const my = useSpring(0, { stiffness: 50, damping: 18 });

  function onMove(e: MouseEvent) {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  }

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      className="relative isolate flex min-h-svh items-center overflow-hidden pb-20 pt-32 lg:pt-28"
    >
      <HeroBackground />
      <div
        className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
        style={{
          background: "radial-gradient(640px circle at var(--sx, 30%) var(--sy, 40%), rgb(255 106 19 / 0.11), transparent 60%)",
        }}
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.35fr_1fr]"
      >
        <div>
          <motion.a
            href="#story"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease }}
            className="beam-border group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-4 text-sm backdrop-blur"
          >
            <span className="rounded-full bg-orange px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-ink">
              News
            </span>
            <span className="text-shimmer font-medium">VietCaPhe has gone wholesale</span>
            <ArrowRight className="size-4 text-cream/60 transition-transform group-hover:translate-x-1" />
          </motion.a>

          <h1 className="mt-8 font-display text-[clamp(2.5rem,5.8vw,5.4rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">
            <SplitText text="Bold robusta." delay={0.45} className="block" />
            <SplitText text="Green, for your" delay={0.65} className="block text-cream/40" />
            <motion.span
              initial={{ opacity: 0, filter: "blur(12px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ delay: 1, duration: 0.8, ease }}
              className="block"
            >
              <TextLoop items={loop} itemClassName="text-gradient pb-[0.12em] pr-[0.05em]" />
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8, ease }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-cream/65 sm:text-xl"
          >
            Specialty-grade, honey-processed robusta from Vietnam's Central Highlands, now supplied green to roasters
            across Australia.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.8, ease }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <ButtonLink href="#contact">
                Request a green sample <ArrowUpRight className="size-4" />
              </ButtonLink>
            </Magnetic>
            <ButtonLink href="#story" variant="ghost">
              I'm a past customer
            </ButtonLink>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-12 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/45"
          >
            {["Cu M'gar, Dak Lak", "Honey processed", "Specialty grade", "Samples on request"].map((t, i) => (
              <li key={t} className="flex items-center gap-2">
                <span className={`size-1.5 rounded-full ${["bg-orange", "bg-amber", "bg-rose", "bg-leaf"][i]}`} />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        <HeroVisual mx={mx} my={my} />
      </motion.div>

      <motion.a
        href="#story"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-cream/40 md:flex"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-orange"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}

function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-20">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      <div className="animate-aurora absolute -left-[10%] -top-[20%] size-[55vw] rounded-full bg-orange/25 blur-[120px]" />
      <div className="animate-aurora absolute -right-[15%] top-[10%] size-[42vw] rounded-full bg-rose/20 blur-[120px] [animation-delay:-6s]" />
      <div className="animate-aurora absolute -bottom-[25%] left-[30%] size-[40vw] rounded-full bg-amber/15 blur-[120px] [animation-delay:-12s]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-b from-transparent to-ink" />
    </div>
  );
}

const chips = [
  { label: "Cocoa", dot: "bg-amber", pos: "left-[0%] top-[22%]", depth: 34, delay: 0 },
  { label: "Syrupy body", dot: "bg-orange", pos: "right-[-2%] top-[40%]", depth: -28, delay: 0.8 },
  { label: "Roasted cashew", dot: "bg-rose", pos: "left-[6%] bottom-[14%]", depth: 24, delay: 1.6 },
  { label: "Honey processed", dot: "bg-leaf", pos: "right-[8%] top-[6%]", depth: -18, delay: 2.4 },
];

function HeroVisual({ mx, my }: { mx: MotionValue<number>; my: MotionValue<number> }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 1.4, ease }}
      className="relative mx-auto aspect-square w-full max-w-[520px] lg:max-w-none"
    >
      <div className="absolute inset-[18%] rounded-full bg-orange/40 blur-[90px]" />
      <div className="absolute inset-[4%] rounded-full border border-white/[0.07]" />
      <div className="animate-spin-slow absolute inset-[16%] rounded-full border border-dashed border-white/10" />

      <svg viewBox="0 0 500 500" className="animate-spin-slow absolute inset-0 size-full [animation-direction:reverse]">
        <defs>
          <path id="ring" d="M 250,250 m -222,0 a 222,222 0 1,1 444,0 a 222,222 0 1,1 -444,0" />
        </defs>
        <text className="fill-cream/45 font-mono text-[13px] uppercase" letterSpacing="4">
          <textPath href="#ring" textLength="1390" lengthAdjust="spacing">
            Specialty robusta ✦ Honey processed ✦ Central Highlands, Vietnam ✦ Green coffee for roasters ✦
          </textPath>
        </text>
      </svg>

      <Parallax mx={mx} my={my} depth={16} className="absolute inset-0 grid place-items-center">
        <Float distance={14} duration={5.5}>
          <Bean className="w-[clamp(150px,38vw,250px)] -rotate-[18deg] drop-shadow-[0_30px_60px_rgb(255_106_19/0.45)]" />
        </Float>
      </Parallax>

      <Parallax mx={mx} my={my} depth={-34} className="absolute right-[14%] top-[16%]">
        <Float distance={10} duration={4.2} delay={0.5}>
          <Bean className="w-12 rotate-[35deg] sm:w-16" colors={["#d9f99d", "#a3e635", "#3f6212"]} />
        </Float>
      </Parallax>
      <Parallax mx={mx} my={my} depth={42} className="absolute bottom-[18%] left-[16%]">
        <Float distance={12} duration={4.8} delay={1}>
          <Bean className="w-14 -rotate-[50deg] sm:w-20" colors={["#ffe08a", "#ffb01f", "#c2410c"]} />
        </Float>
      </Parallax>
      <Parallax mx={mx} my={my} depth={26} className="absolute left-[20%] top-[12%]">
        <Float distance={8} duration={3.8} delay={1.4}>
          <Bean className="w-8 rotate-[70deg] sm:w-10" colors={["#ff9ab3", "#ff3d6e", "#9f1239"]} />
        </Float>
      </Parallax>
      <Parallax mx={mx} my={my} depth={-20} className="absolute bottom-[10%] right-[22%]">
        <Float distance={9} duration={4.4} delay={0.2}>
          <Bean className="w-9 rotate-[10deg] sm:w-12" />
        </Float>
      </Parallax>

      {chips.map((c) => (
        <Parallax key={c.label} mx={mx} my={my} depth={c.depth} className={`absolute hidden sm:block ${c.pos}`}>
          <Float distance={7} duration={4 + c.delay / 2} delay={c.delay}>
            <motion.span
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 1.4 + c.delay / 3, duration: 0.8, ease }}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-ink/50 px-4 py-2 text-sm font-medium text-cream/90 shadow-xl shadow-black/30 backdrop-blur-md"
            >
              <span className={`size-2 rounded-full ${c.dot}`} />
              {c.label}
            </motion.span>
          </Float>
        </Parallax>
      ))}
    </motion.div>
  );
}
