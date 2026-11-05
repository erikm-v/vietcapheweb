import { motion } from "motion/react";
import { ease } from "../components/motion";
import { Logo } from "../components/ui";
import { mailto, site } from "../config";

const explore = [
  { href: "#story", label: "Our news" },
  { href: "#coffee", label: "The coffee" },
  { href: "#process", label: "Process" },
  { href: "#faq", label: "FAQ" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 pt-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 sm:px-8 md:flex-row md:justify-between">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/50">
            Specialty Vietnamese robusta, supplied green to Australian roasters.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-14 text-sm">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/35">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {explore.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-cream/70 transition hover:text-orange">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/35">Contact</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={mailto("Wholesale enquiry")} className="text-cream/70 transition hover:text-orange">
                  {site.email}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-cream/70 transition hover:text-orange">
                  Request a sample
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-2 px-5 text-xs text-cream/35 sm:flex-row sm:justify-between sm:px-8">
        <span>© {new Date().getFullYear()} VietCaPhe. All rights reserved.</span>
        <span>Grown in Vietnam's Central Highlands.</span>
      </div>

      <motion.div
        aria-hidden
        initial={{ y: "40%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease }}
        className="pointer-events-none mt-6 select-none whitespace-nowrap text-center font-display text-[17.5vw] font-extrabold leading-[0.78] tracking-[-0.06em]"
      >
        <span className="bg-linear-to-b from-orange via-orange/60 to-transparent bg-clip-text text-transparent">
          VIETCAPHE
        </span>
      </motion.div>
    </footer>
  );
}
