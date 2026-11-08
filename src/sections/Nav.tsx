import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "../components/ui";
import { ease } from "../components/motion";

const links = [
  { href: "/#story", label: "Our news" },
  { href: "/#coffee", label: "The coffee" },
  { href: "/#process", label: "Process" },
  { href: "/blog/", label: "Blog" },
  { href: "/#faq", label: "FAQ" },
];

export function Nav() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  const solid = scrolled || open;

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease, delay: 0.15 }}
      className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-4"
    >
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full py-2 pl-3 pr-2 transition-all duration-500 sm:pl-4 ${
          solid ? "bg-paper/90 shadow-[0_8px_30px_-10px_rgb(20_13_9/0.35)] backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <a href="/" aria-label="VietCaPhe home">
          <Logo />
        </a>

        <ul className="hidden items-center md:flex" onMouseLeave={() => setHovered(null)}>
          {links.map((l) => (
            <li key={l.href} className="relative">
              <a
                href={l.href}
                onMouseEnter={() => setHovered(l.href)}
                className="relative z-10 block px-4 py-2 text-sm font-semibold text-ink"
              >
                {l.label}
              </a>
              {hovered === l.href && (
                <motion.span
                  layoutId="nav-hover"
                  className="absolute inset-0 rounded-full bg-ink/[0.08]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="/#contact"
            className="group inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-cream transition hover:bg-black"
          >
            <span className="hidden sm:inline">Request a sample</span>
            <span className="sm:hidden">Sample</span>
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full border-2 border-ink/80 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3, ease }}
            className="mx-auto mt-2 max-w-6xl rounded-3xl bg-paper p-3 shadow-xl md:hidden"
          >
            {[...links, { href: "/#contact", label: "Contact" }].map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
                className="block rounded-2xl px-4 py-3 font-display text-2xl font-bold hover:bg-orange"
              >
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
