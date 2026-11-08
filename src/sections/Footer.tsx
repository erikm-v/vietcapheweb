import { motion } from "motion/react";
import { ease } from "../components/motion";
import { Logo } from "../components/ui";
import { mailto, site } from "../config";

const explore = [
  { href: "/#story", label: "Our news" },
  { href: "/#coffee", label: "The coffee" },
  { href: "/#process", label: "Process" },
  { href: "/blog/", label: "Blog" },
  { href: "/#faq", label: "FAQ" },
];

export function Footer() {
  return (
    <footer className="relative -mt-16 overflow-hidden rounded-t-[2.5rem] bg-orange pt-16 text-ink sm:-mt-20 sm:rounded-t-[3.5rem] sm:pt-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-5 sm:px-8 md:flex-row md:justify-between">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs leading-relaxed text-ink/75">
            Specialty Vietnamese robusta, supplied green to Australian roasters.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-14">
          <div>
            <p className="font-bold">Explore</p>
            <ul className="mt-4 space-y-2.5">
              {explore.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-ink/75 underline-offset-4 transition hover:text-ink hover:underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-bold">Contact</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={mailto("Wholesale enquiry")} className="text-ink/75 underline-offset-4 transition hover:text-ink hover:underline">
                  {site.email}
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-ink/75 underline-offset-4 transition hover:text-ink hover:underline">
                  Request a sample
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-2 px-5 text-sm text-ink/65 sm:flex-row sm:justify-between sm:px-8">
        <span>© {new Date().getFullYear()} VietCaPhe. All rights reserved.</span>
        <span>Grown in Vietnam's Central Highlands.</span>
      </div>

      <motion.div
        aria-hidden
        initial={{ y: "50%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease }}
        className="pointer-events-none mt-6 select-none whitespace-nowrap text-center font-display text-[17.5vw] font-extrabold leading-[0.78] tracking-[-0.06em] text-ink"
      >
        VIETCAPHE
      </motion.div>
    </footer>
  );
}
