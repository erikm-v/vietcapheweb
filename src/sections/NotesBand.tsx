import { Marquee } from "../components/motion";
import { Sparkle } from "../components/ui";

const notes = ["Cocoa", "Roasted cashew", "Honey sweetness", "Syrupy body", "Deep & strong", "Holds up in milk", "Thick crema"];
const uses = ["Espresso blends", "Flat whites", "Cà phê sữa đá", "Cold brew", "Phin filter", "Office coffee", "Single-origin espresso"];

export function NotesBand() {
  return (
    <section aria-label="Tasting notes and uses" className="relative overflow-hidden py-14">
      <div className="relative z-10 -mx-4 -rotate-2 bg-orange py-4 text-ink shadow-[0_20px_80px_-20px_rgb(255_106_19/0.6)] sm:py-5">
        <Marquee duration={38}>
          {notes.map((n) => (
            <span
              key={n}
              className="flex items-center gap-10 whitespace-nowrap font-display text-4xl font-extrabold uppercase tracking-tight sm:text-6xl"
            >
              {n}
              <Sparkle className="size-6 sm:size-8" />
            </span>
          ))}
        </Marquee>
      </div>
      <div className="relative -mx-4 -mt-3 rotate-1 border-y border-white/10 bg-ink-3 py-4">
        <Marquee duration={48} reverse>
          {uses.map((u, i) => (
            <span
              key={u}
              className={`flex items-center gap-10 whitespace-nowrap font-display text-2xl font-bold uppercase tracking-tight sm:text-4xl ${
                i % 2 ? "text-outline" : "text-cream/85"
              }`}
            >
              {u}
              <Sparkle className="size-4 text-orange sm:size-5" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
