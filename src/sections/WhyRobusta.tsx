import { Leaf, Milk, Zap } from "lucide-react";
import { CountUp, Reveal, SplitText, SpotlightCard } from "../components/motion";
import { Bean, Eyebrow } from "../components/ui";

export function WhyRobusta() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-x-0 top-1/3 -z-10 mx-auto h-[500px] max-w-5xl rounded-full bg-rose/10 blur-[140px]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Reveal>
              <Eyebrow>Why specialty robusta</Eyebrow>
            </Reveal>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,5.5vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">
              <SplitText text="Robusta," /> <SplitText text="reconsidered." wordClassName="text-gradient" delay={0.15} />
            </h2>
          </div>
          <Reveal delay={0.2}>
            <p className="max-w-md text-lg leading-relaxed text-cream/60">
              Most robusta is grown for volume. Ours is grown, picked and processed for the cup.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-6">
          <Reveal className="lg:col-span-4 lg:row-span-2">
            <SpotlightCard className="h-full min-h-[340px] p-8 sm:p-10">
              <Bean className="pointer-events-none absolute -bottom-24 -right-16 w-56 rotate-[30deg] opacity-70 transition-transform duration-700 group-hover:rotate-[20deg] group-hover:scale-105 sm:w-72" />
              <div className="relative flex h-full flex-col justify-between gap-10">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-cream/45">Not the robusta you've been warned about</p>
                <div className="max-w-lg">
                  <h3 className="font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
                    Selectively harvested. Honey processed. Specialty grade.
                  </h3>
                  <p className="mt-5 text-lg leading-relaxed text-cream/60">
                    Controlled mucilage fermentation gives this robusta natural sweetness, cocoa depth and a syrupy
                    body, without the harsh, rubbery edge commodity robusta is known for.
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal className="lg:col-span-2" delay={0.1}>
            <SpotlightCard className="h-full p-8" glow="rgb(255 176 31 / 0.16)">
              <Zap className="size-6 text-amber" strokeWidth={1.75} />
              <p className="mt-6 font-display text-7xl font-extrabold tracking-tight text-amber">
                <CountUp to={2} suffix="×" />
              </p>
              <p className="mt-2 text-cream/60">Up to twice the caffeine of arabica, for a strong, steady lift.</p>
            </SpotlightCard>
          </Reveal>

          <Reveal className="lg:col-span-2" delay={0.2}>
            <SpotlightCard className="h-full p-8" glow="rgb(255 61 110 / 0.16)" edge="rgb(255 61 110 / 0.7)">
              <Leaf className="size-6 text-rose" strokeWidth={1.75} />
              <p className="mt-6 font-display text-7xl font-extrabold tracking-tight text-rose">
                <CountUp to={100} suffix="%" />
              </p>
              <p className="mt-2 text-cream/60">Vietnamese robusta, traceable to province and process.</p>
            </SpotlightCard>
          </Reveal>

          <Reveal className="lg:col-span-3" delay={0.1}>
            <SpotlightCard className="h-full p-8" glow="rgb(163 230 53 / 0.12)" edge="rgb(163 230 53 / 0.6)">
              <p className="font-display text-5xl font-extrabold tracking-tight text-leaf">No. 1</p>
              <p className="mt-3 max-w-sm text-cream/60">
                Vietnam grows more robusta than any other country. The Central Highlands are its heartland.
              </p>
            </SpotlightCard>
          </Reveal>

          <Reveal className="lg:col-span-3" delay={0.2}>
            <SpotlightCard className="h-full p-8">
              <Milk className="size-6 text-orange" strokeWidth={1.75} />
              <h3 className="mt-6 font-display text-2xl font-bold tracking-tight">Built for milk and crema</h3>
              <p className="mt-2 max-w-sm text-cream/60">
                The body and cocoa cut straight through a flat white or condensed milk, and it brings thick, lasting
                crema to an espresso blend.
              </p>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
