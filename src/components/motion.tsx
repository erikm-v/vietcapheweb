import { animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform, type MotionValue, type Variants } from "motion/react";
import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;

const splitContainer: Variants = {
  hidden: {},
  visible: (c: { delay: number; stagger: number }) => ({
    transition: { delayChildren: c.delay, staggerChildren: c.stagger },
  }),
};

const splitWord: Variants = {
  hidden: { opacity: 0, y: "0.4em", rotate: 4 },
  visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.8, ease } },
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
            <motion.span variants={splitWord} className={`inline-block origin-bottom-left pb-[0.06em] ${wordClassName}`}>
              {w}
            </motion.span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 32,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
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
          className="animate-marquee flex shrink-0 items-center gap-8 pr-8 group-hover:[animation-play-state:paused]"
          style={{ animationDuration: `${duration}s`, animationDirection: reverse ? "reverse" : "normal" }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

export function Tilt({ children, className = "", max = 6 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 150, damping: 18 });
  const ry = useSpring(0, { stiffness: 150, damping: 18 });

  function onMove(e: MouseEvent) {
    const r = ref.current!.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
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

/** Paragraph whose words darken as it scrolls through the viewport. Wrap a word in *asterisks* to highlight it. */
export function ScrollRevealText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((raw, i) => {
        const start = i / words.length;
        return (
          <RevealWord
            key={i}
            progress={scrollYProgress}
            range={[start, start + 1 / words.length]}
            highlight={raw.startsWith("*")}
          >
            {raw.replaceAll("*", "")}
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
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <>
      <motion.span style={{ opacity }} className={highlight ? "text-orange" : undefined}>
        {children}
      </motion.span>{" "}
    </>
  );
}

/** Rotates its children as the page scrolls. */
export function ScrollSpin({ children, className = "", speed = 0.12 }: { children: ReactNode; className?: string; speed?: number }) {
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, (v) => v * speed);
  return (
    <motion.div style={{ rotate }} className={className}>
      {children}
    </motion.div>
  );
}
