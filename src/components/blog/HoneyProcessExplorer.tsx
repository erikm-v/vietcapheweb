import { useState } from "react";
import { MotionConfig, motion } from "motion/react";

type Process = {
  id: string;
  name: string;
  mucilage: number;
  skin: boolean;
  colour: string;
  summary: string;
  traits: [number, number, number, number, number];
};

const traitNames = ["Sweetness", "Body", "Clarity", "Drying time", "Ferment risk"];

const processes: Process[] = [
  {
    id: "washed",
    name: "Washed",
    mucilage: 0,
    skin: false,
    colour: "#e9dcc3",
    summary: "Skin and all the mucilage come off before drying. The cleanest, most transparent cup, with the least sweetness carried from the fruit.",
    traits: [2, 2, 5, 2, 1],
  },
  {
    id: "white",
    name: "White honey",
    mucilage: 0.12,
    skin: false,
    colour: "#f3e2a0",
    summary: "Most of the mucilage is scrubbed away, leaving a thin film. A touch more sweetness than washed while staying very clean.",
    traits: [2.6, 2.5, 4.5, 2.5, 1.5],
  },
  {
    id: "yellow",
    name: "Yellow honey",
    mucilage: 0.35,
    skin: false,
    colour: "#f5c542",
    summary: "A moderate layer of mucilage dries on the parchment. Rounder sweetness and body, still clean. A common sweet spot for espresso.",
    traits: [3.3, 3.1, 4, 3.1, 2],
  },
  {
    id: "red",
    name: "Red honey",
    mucilage: 0.65,
    skin: false,
    colour: "#e0672a",
    summary: "Most of the mucilage stays on and drying slows down. More sweetness and syrupy body, with more fermentation character to manage.",
    traits: [4, 3.9, 3.2, 3.9, 3],
  },
  {
    id: "black",
    name: "Black honey",
    mucilage: 0.9,
    skin: false,
    colour: "#6b2d16",
    summary: "Nearly all the mucilage stays on, often dried slowly under cover. The sweetest, heaviest honey style, and the hardest to get right.",
    traits: [4.6, 4.5, 2.5, 4.6, 4],
  },
  {
    id: "natural",
    name: "Natural",
    mucilage: 1,
    skin: true,
    colour: "#a3261b",
    summary: "The whole cherry dries intact, skin and all. Heaviest body and fruit, longest drying and the most fermentation risk.",
    traits: [4.5, 5, 2, 5, 4.5],
  },
];

const spring = { type: "spring", stiffness: 140, damping: 20 } as const;

function CherrySection({ p }: { p: Process }) {
  const bean = 62;
  const parchment = bean + 7;
  const muc = parchment + 4 + p.mucilage * 34;
  const skin = muc + (p.skin ? 9 : 0);
  return (
    <svg viewBox="-130 -130 260 260" className="w-full max-w-[280px]" role="img" aria-label={`Cross-section of a coffee seed prepared as ${p.name}`}>
      <motion.circle r={skin} fill="#a3261b" animate={{ r: skin, opacity: p.skin ? 1 : 0 }} transition={spring} />
      <motion.circle r={muc} animate={{ r: muc, fill: p.colour }} transition={spring} />
      {p.mucilage > 0.2 &&
        Array.from({ length: 10 }, (_, i) => {
          const t = (i / 10) * Math.PI * 2;
          const rr = parchment + 2 + (muc - parchment) * 0.55;
          return (
            <motion.circle
              key={`${p.id}${i}`}
              cx={Math.cos(t) * rr}
              cy={Math.sin(t) * rr}
              initial={{ r: 0 }}
              animate={{ r: 2 + p.mucilage * 2.5 }}
              transition={{ ...spring, delay: i * 0.02 }}
              fill="#fffaf2"
              opacity={0.45}
            />
          );
        })}
      <circle r={parchment} fill="#f6eee2" />
      <ellipse rx={bean * 0.78} ry={bean} fill="#9aa37a" />
      <ellipse rx={bean * 0.78} ry={bean} fill="#6f7a52" opacity="0.4" transform="translate(6 6) scale(0.9)" />
      <path d="M4 -56 C -26 -24, 30 18, -4 56" fill="none" stroke="#4f5838" strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

export default function HoneyProcessExplorer() {
  const [active, setActive] = useState("yellow");
  const p = processes.find((x) => x.id === active)!;

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div className="flex flex-col items-center">
          <CherrySection p={p} />
          <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs font-semibold text-ink/60">
            <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-[#9aa37a]" /> Green bean</span>
            <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-cream ring-1 ring-ink/20" /> Parchment</span>
            <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-yellow" /> Mucilage</span>
            <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-[#a3261b]" /> Skin</span>
          </div>
        </div>

        <div>
          <div role="tablist" aria-label="Processing method" className="flex flex-wrap gap-x-1 gap-y-2 border-b-2 border-ink/10 pb-3">
            {processes.map((x) => (
              <button
                key={x.id}
                role="tab"
                aria-selected={x.id === active}
                onClick={() => setActive(x.id)}
                className={`relative px-2.5 py-1.5 text-sm font-bold transition-colors ${x.id === active ? "text-ink" : "text-ink/45 hover:text-ink/80"}`}
              >
                {x.name}
                {x.id === active && (
                  <motion.span layoutId="honey-tab" className="absolute inset-x-1 -bottom-[14px] h-[3px] rounded-full bg-orange" />
                )}
              </button>
            ))}
          </div>

          <motion.p key={p.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5 min-h-[4.5rem] text-[15px] leading-relaxed text-ink/80">
            {p.summary}
          </motion.p>

          <dl className="mt-5 space-y-3">
            {traitNames.map((t, i) => (
              <div key={t} className="grid grid-cols-[7.5rem_1fr] items-center gap-3">
                <dt className="text-sm font-semibold text-ink/70">{t}</dt>
                <dd className="h-3 overflow-hidden rounded-full bg-ink/10">
                  <motion.div
                    className={`h-full rounded-full ${i >= 3 ? "bg-ink" : "bg-orange"}`}
                    initial={false}
                    animate={{ width: `${(p.traits[i] / 5) * 100}%` }}
                    transition={spring}
                  />
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-ink/50">Relative tendencies, not measurements. Honey colour names aren't standardised between producers.</p>
        </div>
      </div>
    </MotionConfig>
  );
}
