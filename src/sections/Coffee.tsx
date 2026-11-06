import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Magnetic, Reveal, ScrollSpin, SplitText, ease } from "../components/motion";
import { Bean, ButtonLink } from "../components/ui";
import { mailto } from "../config";

const spec = [
  ["Origin", "Central Highlands, Vietnam"],
  ["Region", "Cu M'gar, Dak Lak"],
  ["Species", "Robusta (Coffea canephora)"],
  ["Process", "Honey"],
  ["Grade", "Specialty"],
  ["Body", "Syrupy, deep and strong"],
  ["Roast range", "Medium to dark"],
];

const lots = [
  {
    n: "02",
    title: "Gia Lai Honey",
    region: "Chu Pah & Dak Doa, Gia Lai",
    body: "Small, traceable honey-processed lots from the Gia Lai highlands. Made for single-origin robusta espresso and feature coffees.",
    card: "bg-yellow text-ink",
    link: "text-ink",
  },
  {
    n: "03",
    title: "Anaerobic Lots",
    region: "Gia Lai & Dak Lak",
    body: "An anaerobic honey and an anaerobic natural. Fermented, expressive and available in small quantities, for cupping tables, barista training and limited releases.",
    card: "bg-ink text-cream",
    link: "text-orange",
  },
  {
    n: "04",
    title: "Community Lots",
    region: "Cu M'gar, Dak Lak",
    body: "Dependable Dak Lak robusta from Cu M'gar growing communities. A consistent base for house blends and high-volume programs.",
    card: "bg-paper text-ink ring-2 ring-ink",
    link: "text-ink",
  },
];

export function Coffee() {
  return (
    <section id="coffee" className="relative -mt-16 rounded-t-[2.5rem] bg-cream pb-36 pt-24 sm:-mt-20 sm:rounded-t-[3.5rem] sm:pb-44 sm:pt-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <h2 className="font-display text-[clamp(2.6rem,6vw,5.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em]">
            <SplitText text="Green coffee for" /> <SplitText text="Australian roasters." wordClassName="text-orange" delay={0.2} />
          </h2>
          <Reveal delay={0.15}>
            <p className="text-lg leading-relaxed text-ink/70">
              Our focus is specialty-grade, honey-processed robusta. Around it sits a small range of micro-lots,
              fermented lots and dependable blend-base coffee, all from Vietnam's Central Highlands.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-16">
          <div className="relative rounded-[2.5rem] bg-orange p-7 sm:p-12 lg:p-14">
            <ScrollSpin className="pointer-events-none absolute -right-4 -top-12 w-24 sm:-right-8 sm:w-32" speed={0.08}>
              <Bean />
            </ScrollSpin>
            <ScrollSpin className="pointer-events-none absolute -top-6 right-24 hidden w-14 sm:block" speed={-0.12}>
              <Bean />
            </ScrollSpin>

            <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
              <div>
                <p className="text-lg font-bold">01 · Our focus</p>
                <h3 className="mt-4 font-display text-[clamp(2.6rem,5.4vw,5rem)] font-extrabold leading-[0.9] tracking-[-0.035em]">
                  Honey Processed Specialty Robusta
                </h3>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/80">
                  The coffee that built VietCaPhe. Selectively harvested in Cu M'gar, Dak Lak, then honey processed so
                  the fruit's sweetness carries into the bean.
                </p>

                <p className="mt-8 text-sm font-bold uppercase tracking-wide text-ink/60">In the cup</p>
                <p className="mt-2 font-display text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
                  Cocoa, roasted cashew and honey, with a syrupy body that holds its own in milk.
                </p>

                <p className="mt-8 text-sm font-bold uppercase tracking-wide text-ink/60">Best in</p>
                <p className="mt-2 text-lg text-ink/85">
                  Espresso blends, milk-based menus, phin and cà phê sữa đá, cold brew, office and hospitality.
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <Magnetic>
                    <ButtonLink href={mailto("Green sample request: honey processed specialty robusta")}>
                      Request a green sample <ArrowUpRight className="size-4" />
                    </ButtonLink>
                  </Magnetic>
                  <ButtonLink href="#process" variant="outline">
                    How it's processed
                  </ButtonLink>
                </div>
              </div>

              <dl className="self-center rounded-[1.75rem] bg-paper px-6 py-3 sm:px-8">
                {spec.map(([k, v], i) => (
                  <motion.div
                    key={k}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease }}
                    className="flex items-baseline justify-between gap-6 border-b border-ink/10 py-4 last:border-0"
                  >
                    <dt className="shrink-0 text-ink/55">{k}</dt>
                    <dd className="text-right font-semibold">{v}</dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {lots.map((l, i) => (
            <Reveal key={l.title} delay={i * 0.1}>
              <div
                className={`flex h-full flex-col rounded-[2rem] p-7 transition-transform duration-500 hover:-translate-y-1.5 sm:p-8 ${l.card}`}
              >
                <p className="font-display text-5xl font-extrabold opacity-25">{l.n}</p>
                <h3 className="mt-4 font-display text-3xl font-bold tracking-tight">{l.title}</h3>
                <p className="mt-1 text-sm font-semibold opacity-60">{l.region}</p>
                <p className="mt-4 flex-1 leading-relaxed opacity-80">{l.body}</p>
                <a
                  href={mailto(`Enquiry: ${l.title}`)}
                  className={`group/link mt-8 inline-flex items-center gap-1.5 font-semibold ${l.link}`}
                >
                  Ask about this lot
                  <ArrowUpRight className="size-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-8 text-center text-ink/55">
            Availability changes with each harvest. Ask us for the current lot list and pricing.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
