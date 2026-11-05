import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Magnetic, Reveal, SplitText, SpotlightCard, ease } from "../components/motion";
import { Bean, ButtonLink, Eyebrow, Tag, type TagColor } from "../components/ui";
import { mailto } from "../config";

const spec = [
  ["Origin", "Central Highlands, Vietnam"],
  ["Region", "Cu M'gar, Dak Lak"],
  ["Species", "Coffea canephora (robusta)"],
  ["Process", "Honey"],
  ["Grade", "Specialty"],
  ["Cup", "Cocoa, roasted cashew, honey"],
  ["Body", "Syrupy, deep and strong"],
  ["Roast range", "Medium to dark"],
];

const notes = ["Cocoa", "Roasted cashew", "Honey", "Syrupy body", "Holds up in milk"];
const bestIn = ["Espresso blends", "Milk-based menus", "Phin & cà phê sữa đá", "Cold brew", "Office & hospitality"];

const lots: {
  tag: string;
  color: TagColor;
  title: string;
  region: string;
  body: string;
  glow: string;
  edge: string;
  bean: [string, string, string];
}[] = [
  {
    tag: "Micro-lot",
    color: "amber",
    title: "Gia Lai Honey",
    region: "Chu Pah & Dak Doa, Gia Lai",
    body: "Small, traceable honey-processed lots from the Gia Lai highlands. Made for single-origin robusta espresso and feature coffees.",
    glow: "rgb(255 176 31 / 0.15)",
    edge: "rgb(255 176 31 / 0.7)",
    bean: ["#ffe08a", "#ffb01f", "#c2410c"],
  },
  {
    tag: "Limited",
    color: "rose",
    title: "Anaerobic Lots",
    region: "Gia Lai & Dak Lak",
    body: "An anaerobic honey and an anaerobic natural. Fermented, expressive and available in small quantities, for cupping tables, barista training and limited releases.",
    glow: "rgb(255 61 110 / 0.15)",
    edge: "rgb(255 61 110 / 0.7)",
    bean: ["#ff9ab3", "#ff3d6e", "#9f1239"],
  },
  {
    tag: "Volume",
    color: "leaf",
    title: "Community Lots",
    region: "Cu M'gar, Dak Lak",
    body: "Dependable Dak Lak robusta from Cu M'gar growing communities. A consistent base for house blends and high-volume programs.",
    glow: "rgb(163 230 53 / 0.12)",
    edge: "rgb(163 230 53 / 0.6)",
    bean: ["#d9f99d", "#a3e635", "#3f6212"],
  },
];

export function Coffee() {
  return (
    <section id="coffee" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow>For roasters & green buyers</Eyebrow>
          </Reveal>
          <h2 className="mt-6 font-display text-[clamp(2.4rem,5.5vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">
            <SplitText text="Green coffee for" />{" "}
            <SplitText text="Australian roasters." wordClassName="text-gradient" delay={0.2} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 text-lg leading-relaxed text-cream/60">
              Our focus is specialty-grade, honey-processed robusta. Around it sits a small range of micro-lots,
              fermented lots and dependable blend-base coffee, all from Vietnam's Central Highlands.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <div className="beam-border relative overflow-hidden rounded-[2rem] border border-white/10 bg-linear-to-br from-orange/[0.14] via-ink-2 to-ink-2 p-6 sm:p-12">
            <div className="pointer-events-none absolute -right-32 -top-32 size-[420px] rounded-full bg-orange/20 blur-[110px]" />
            <div className="relative grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
              <div>
                <Tag>Flagship · Our focus</Tag>
                <h3 className="mt-6 font-display text-[clamp(2.4rem,5vw,4.5rem)] font-extrabold leading-[0.92] tracking-[-0.03em]">
                  Honey Processed
                  <br />
                  <span className="text-gradient pb-1">Specialty Robusta</span>
                </h3>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-cream/65">
                  The coffee that built VietCaPhe. Selectively harvested in Cu M'gar, Dak Lak, then honey processed so
                  the fruit's sweetness carries into the bean. The result is cocoa depth, nutty sweetness and a syrupy
                  body that holds its own in milk.
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {notes.map((n, i) => (
                    <motion.span
                      key={n}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.07, duration: 0.5, ease }}
                      className="rounded-full border border-orange/25 bg-orange/10 px-4 py-1.5 text-sm font-medium text-orange"
                    >
                      {n}
                    </motion.span>
                  ))}
                </div>

                <div className="mt-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cream/40">Best in</p>
                  <p className="mt-2 text-cream/75">{bestIn.join("  ·  ")}</p>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Magnetic>
                    <ButtonLink href={mailto("Green sample request: honey processed specialty robusta")}>
                      Request a green sample <ArrowUpRight className="size-4" />
                    </ButtonLink>
                  </Magnetic>
                  <ButtonLink href="#process" variant="ghost">
                    How it's processed
                  </ButtonLink>
                </div>
              </div>

              <div className="relative self-center">
                <Bean className="pointer-events-none absolute -right-6 -top-14 w-28 rotate-[25deg] drop-shadow-[0_20px_40px_rgb(255_106_19/0.5)] sm:w-36" />
                <dl className="relative rounded-3xl border border-white/10 bg-ink/70 p-2 font-mono text-sm backdrop-blur-xl">
                  {spec.map(([k, v], i) => (
                    <motion.div
                      key={k}
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease }}
                      className="flex items-baseline justify-between gap-6 border-b border-white/[0.06] px-4 py-3.5 last:border-0 sm:px-5"
                    >
                      <dt className="shrink-0 text-[11px] uppercase tracking-[0.16em] text-cream/40">{k}</dt>
                      <dd className="text-right text-cream/90">{v}</dd>
                    </motion.div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {lots.map((l, i) => (
            <Reveal key={l.title} delay={i * 0.1}>
              <SpotlightCard className="h-full p-7 sm:p-8" glow={l.glow} edge={l.edge}>
                <div className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <Tag color={l.color}>{l.tag}</Tag>
                    <Bean
                      className="w-10 rotate-[20deg] transition-transform duration-500 group-hover:rotate-[50deg] group-hover:scale-110"
                      colors={l.bean}
                    />
                  </div>
                  <h3 className="mt-6 font-display text-3xl font-bold tracking-tight">{l.title}</h3>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-cream/40">{l.region}</p>
                  <p className="mt-4 flex-1 leading-relaxed text-cream/60">{l.body}</p>
                  <a
                    href={mailto(`Enquiry: ${l.title}`)}
                    className="group/link mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-cream"
                  >
                    Ask about this lot
                    <ArrowUpRight className="size-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                  </a>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-8 text-center font-mono text-xs uppercase tracking-[0.18em] text-cream/40">
            Availability changes with each harvest. Ask us for the current lot list and pricing.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
