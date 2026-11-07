import { Marquee } from "../components/motion";

const notes = ["Cocoa", "Roasted cashew", "Honey sweetness", "Syrupy body", "Deep & strong", "Holds up in milk"];
const uses = ["Espresso blends", "Flat whites", "Cà phê sữa đá", "Cold brew", "Phin filter", "Single-origin espresso"];

export function NotesBand() {
  return (
    <section
      aria-label="Tasting notes and uses"
      className="relative overflow-hidden bg-[linear-gradient(to_bottom,var(--color-orange)_50%,var(--color-cream)_50%)] py-10"
    >
      <div className="relative z-10 -mx-4 -rotate-2 bg-ink py-4 text-cream sm:py-5">
        <Marquee duration={38}>
          {notes.map((n) => (
            <span
              key={n}
              className="flex items-center gap-8 whitespace-nowrap font-display text-4xl font-extrabold uppercase tracking-tight sm:text-6xl"
            >
              {n}
              <span className="size-3 rounded-full bg-orange sm:size-4" />
            </span>
          ))}
        </Marquee>
      </div>
      <div className="relative -mx-4 -rotate-2 bg-yellow py-3.5 text-ink">
        <Marquee duration={46} reverse>
          {uses.map((u) => (
            <span
              key={u}
              className="flex items-center gap-8 whitespace-nowrap font-display text-2xl font-bold uppercase tracking-tight sm:text-4xl"
            >
              {u}
              <span className="size-2.5 rounded-full bg-ink" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
