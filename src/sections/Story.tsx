import { ArrowUpRight, HeartHandshake, Mail, Store } from "lucide-react";
import bagImg from "../assets/vietcaphe-bag.jpg";
import { Reveal, ScrollRevealText, ScrollSpin, SplitText, Tilt } from "../components/motion";
import { LogoMark } from "../components/ui";
import { mailto } from "../config";

const letter =
  "We started VietCaPhe to show Australia what *Vietnamese* *robusta* can really taste like. You brewed it in your phin, poured it over condensed milk and told us it was the real thing. Thank you. Selling bag by bag, we could only ever reach so many kitchens. By supplying *roasters* with our green beans, the same coffee can reach *cafés,* *offices* and *homes* right across the country. More impact, more great robusta in Australia, and more people discovering what it can be.";

const notes = [
  {
    icon: Store,
    title: "Our online store has closed",
    body: "We no longer sell roasted bags or brewing gear direct. Our beans now go to roasters instead.",
    card: "bg-orange text-ink",
    iconWrap: "bg-ink text-orange",
  },
  {
    icon: Mail,
    title: "Question about a past order?",
    body: "Drop us a line and we'll sort it out.",
    link: { href: mailto("Question about a past order"), label: "Email us" },
    card: "bg-ink text-cream",
    iconWrap: "bg-yellow text-ink",
  },
  {
    icon: HeartHandshake,
    title: "Know a roaster who'd love it?",
    body: "Send them our way. Every roaster who brings it on means more cups of great robusta.",
    card: "bg-yellow text-ink",
    iconWrap: "bg-ink text-yellow",
  },
];

function Sticker() {
  const text = "THANK YOU AUSTRALIA • THANK YOU AUSTRALIA • ";
  return (
    <div className="relative size-32 sm:size-40">
      <ScrollSpin className="absolute inset-0" speed={0.1}>
        <svg viewBox="0 0 200 200" className="absolute inset-0 size-full">
          <circle cx="100" cy="100" r="100" className="fill-yellow" />
          <defs>
            <path id="sticker-ring" d="M 100,100 m -74,0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0" />
          </defs>
          <text className="fill-ink font-display text-[19px] font-extrabold" letterSpacing="1.5">
            <textPath href="#sticker-ring" textLength="462" lengthAdjust="spacing">
              {text}
            </textPath>
          </text>
        </svg>
        <span className="absolute inset-0 grid place-items-center">
          <LogoMark className="size-12 sm:size-14" />
        </span>
      </ScrollSpin>
    </div>
  );
}

export function Story() {
  return (
    <section id="story" className="relative bg-cream pb-36 pt-20 sm:pb-44 sm:pt-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 className="max-w-4xl font-display text-[clamp(2.8rem,7vw,6.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em]">
          <SplitText text="We've gone" /> <SplitText text="wholesale." wordClassName="text-orange" delay={0.2} />
        </h2>

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative">
              <Tilt className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
                <img
                  src={bagImg}
                  alt="A bag of VietCaPhe specialty robusta beside a clay teapot"
                  className="absolute inset-0 size-full object-cover object-[74%_center]"
                  loading="lazy"
                />
              </Tilt>
              <div className="absolute -right-3 -top-10 sm:-right-8">
                <Sticker />
              </div>
            </div>
            <p className="mt-6 font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
              Every bag you bought helped get us here.
            </p>
          </Reveal>

          <div>
            <ScrollRevealText
              text={letter}
              className="font-display text-[clamp(1.5rem,2.6vw,2.3rem)] font-semibold leading-[1.28] tracking-tight"
            />
            <Reveal>
              <p className="mt-8 text-lg text-ink/60">Erik and the VietCaPhe team</p>
            </Reveal>

            <div className="mt-14 grid gap-4 sm:grid-cols-3">
              {notes.map((n, i) => (
                <Reveal key={n.title} delay={i * 0.1}>
                  <div
                    className={`flex h-full flex-col rounded-[1.75rem] p-6 transition-transform duration-500 hover:-translate-y-1.5 hover:-rotate-1 ${n.card}`}
                  >
                    <span className={`grid size-11 place-items-center rounded-full ${n.iconWrap}`}>
                      <n.icon className="size-5" strokeWidth={2} />
                    </span>
                    <h3 className="mt-6 font-display text-xl font-bold leading-tight">{n.title}</h3>
                    <p className="mt-2 flex-1 text-[15px] leading-relaxed opacity-75">{n.body}</p>
                    {n.link && (
                      <a href={n.link.href} className="group/link mt-4 inline-flex items-center gap-1 font-semibold text-yellow">
                        {n.link.label}
                        <ArrowUpRight className="size-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                      </a>
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
