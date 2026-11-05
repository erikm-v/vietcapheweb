import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;

const splitContainer: Variants = {
  hidden: {},
  visible: (c: { delay: number; stagger: number }) => ({
    transition: { delayChildren: c.delay, staggerChildren: c.stagger },
  }),
};

const splitWord: Variants = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(12px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease } },
};

export function SplitText({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.07,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-8% 0px" }}
        variants={splitContainer}
        custom={{ delay, stagger }}
      >
        {words.map((w, i) => (
          <span key={i}>
            <motion.span variants={splitWord} className={`inline-block pb-[0.08em] ${wordClassName}`}>
              {w}
            </motion.span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export function TextLoop({
  items,
  interval = 2600,
  className = "",
  itemClassName = "",
}: {
  items: string[];
  interval?: number;
  className?: string;
  itemClassName?: string;
}) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((v) => (v + 1) % items.length), interval);
    return () => clearInterval(t);
  }, [items.length, interval]);

  return (
    <span className={`relative inline-grid ${className}`} aria-live="polite">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={index}
          initial={{ y: "55%", opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-55%", opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease }}
          className={`col-start-1 row-start-1 whitespace-nowrap ${itemClassName}`}
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Magnetic({
  children,
  strength = 0.3,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });

  function onMove(e: MouseEvent) {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function SpotlightCard({
  children,
  className = "",
  glow = "rgb(255 106 19 / 0.16)",
  edge = "rgb(255 176 31 / 0.75)",
}: {
  children: ReactNode;
  className?: string;
  glow?: string;
  edge?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: MouseEvent) {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      style={{ "--glow": glow, "--edge": edge } as CSSProperties}
      className={`group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(520px circle at var(--mx) var(--my), var(--glow), transparent 42%)" }}
      />
      <div className="spotlight-border pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

export function Marquee({
  children,
  reverse = false,
  duration = 40,
  className = "",
}: {
  children: ReactNode;
  reverse?: boolean;
  duration?: number;
  className?: string;
}) {
  return (
    <div className={`group flex overflow-hidden ${className}`}>
      {[0, 1].map((k) => (
        <div
          key={k}
          aria-hidden={k === 1}
          className="animate-marquee flex shrink-0 items-center gap-10 pr-10 group-hover:[animation-play-state:paused]"
          style={{ animationDuration: `${duration}s`, animationDirection: reverse ? "reverse" : "normal" }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

export function Tilt({ children, className = "", max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 150, damping: 18 });
  const ry = useSpring(0, { stiffness: 150, damping: 18 });

  function onMove(e: MouseEvent) {
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({
  to,
  prefix = "",
  suffix = "",
  duration = 1.8,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const value = useMotionValue(0);
  const display = useTransform(value, (v) => `${prefix}${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration, ease });
    return () => controls.stop();
  }, [inView, to, duration, value]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

/** Paragraph whose words light up as it scrolls through the viewport. Wrap a word in *asterisks* to highlight it. */
export function ScrollRevealText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((raw, i) => {
        const highlight = raw.startsWith("*");
        const word = raw.replaceAll("*", "");
        const start = i / words.length;
        return (
          <RevealWord key={i} progress={scrollYProgress} range={[start, start + 1 / words.length]} highlight={highlight}>
            {word}
          </RevealWord>
        );
      })}
    </p>
  );
}

function RevealWord({
  children,
  progress,
  range,
  highlight,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  highlight: boolean;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <>
      <motion.span style={{ opacity }} className={highlight ? "text-orange" : undefined}>
        {children}
      </motion.span>{" "}
    </>
  );
}

export function Parallax({
  mx,
  my,
  depth,
  className = "",
  children,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  depth: number;
  className?: string;
  children: ReactNode;
}) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.div style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
}

export function Float({
  children,
  className = "",
  distance = 12,
  duration = 5,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{ y: [-distance, distance] }}
      transition={{ duration, delay, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
