import { ArrowUpRight, HeartHandshake, Mail, Store } from "lucide-react";
import bagImg from "../assets/vietcaphe-bag.jpg";
import { Reveal, ScrollRevealText, SplitText, SpotlightCard, Tilt } from "../components/motion";
import { Eyebrow } from "../components/ui";
import { mailto } from "../config";

const letter =
  "We started VietCaPhe to show Australia what *Vietnamese* *robusta* can really taste like. You brewed it in your phin, poured it over condensed milk and told us it was the real thing. Thank you. Selling bag by bag, we could only ever reach so many kitchens. By supplying *roasters* with our green beans, the same coffee can reach *cafés,* *offices* and *homes* right across the country. More impact, more great robusta in Australia, and more people discovering what it can be.";

const notes = [
  {
    icon: Store,
    title: "Our online store has closed",
    body: "We no longer sell roasted bags or brewing gear direct. Our beans now go to roasters instead.",
    color: "text-orange",
  },
  {
    icon: Mail,
    title: "Question about a past order?",
    body: "Drop us a line and we'll sort it out.",
    link: { href: mailto("Question about a past order"), label: "Email us" },
    color: "text-amber",
  },
  {
    icon: HeartHandshake,
    title: "Know a roaster who'd love it?",
    body: "Send them our way. Every roaster who brings it on means more cups of great robusta.",
    color: "text-rose",
  },
];

export function Story() {
  return (
    <section id="story" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow>A note to our customers</Eyebrow>
        </Reveal>
        <h2 className="mt-6 max-w-4xl font-display text-[clamp(2.6rem,6.5vw,6rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">
          <SplitText text="We've gone" /> <SplitText text="wholesale." wordClassName="text-gradient" delay={0.2} />
        </h2>

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <Tilt className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-orange/10">
              <img
                src={bagImg}
                alt="A bag of VietCaPhe specialty robusta beside a clay teapot"
                className="absolute inset-0 size-full object-cover object-[74%_center]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-amber">Thank you, Australia</p>
                <p className="mt-3 font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl">
                  Every bag you bought helped get us here.
                </p>
              </div>
            </Tilt>
          </Reveal>

          <div>
            <ScrollRevealText
              text={letter}
              className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-[1.3] tracking-tight"
            />
            <Reveal>
              <p className="mt-8 font-mono text-sm text-cream/50">Erik and the VietCaPhe team</p>
            </Reveal>

            <div className="mt-14 grid gap-4 sm:grid-cols-3">
              {notes.map((n, i) => (
                <Reveal key={n.title} delay={i * 0.1}>
                  <SpotlightCard className="h-full p-6">
                    <n.icon className={`size-6 ${n.color}`} strokeWidth={1.75} />
                    <h3 className="mt-5 font-display text-lg font-bold leading-tight">{n.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-cream/55">{n.body}</p>
                    {n.link && (
                      <a
                        href={n.link.href}
                        className="group/link mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber"
                      >
                        {n.link.label}
                        <ArrowUpRight className="size-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                      </a>
                    )}
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
