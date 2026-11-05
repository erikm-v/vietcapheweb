import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Copy, Send } from "lucide-react";
import { Reveal, SplitText, ease } from "../components/motion";
import { Eyebrow } from "../components/ui";
import { mailto, site } from "../config";

const roles = ["Roaster", "Café / hospitality", "Green buyer", "Past customer", "Other"];
const interests = ["Honey processed (flagship)", "Gia Lai micro-lots", "Anaerobic lots", "Community lots"];
const perks = [
  "Green samples for roasters",
  "Traceable to province and process",
  "Straight answers on availability",
  "Past customers welcome too",
];

const field =
  "w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-cream placeholder:text-cream/30 outline-none transition focus:border-orange/60 focus:bg-white/[0.05] focus:ring-4 focus:ring-orange/10";

type Status = "idle" | "sending" | "sent";

export function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    await navigator.clipboard.writeText(site.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section id="contact" className="relative isolate overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_100%,black,transparent)]" />
        <div className="animate-aurora absolute -bottom-1/3 left-1/2 size-[70vw] -translate-x-1/2 rounded-full bg-orange/20 blur-[140px]" />
        <div className="absolute inset-x-0 top-0 h-72 bg-linear-to-b from-ink to-transparent" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow>Get in touch</Eyebrow>
          </Reveal>
          <h2 className="mt-6 font-display text-[clamp(2.6rem,6vw,5.5rem)] font-extrabold leading-[0.92] tracking-[-0.035em]">
            <SplitText text="Let's put robusta on" />{" "}
            <SplitText text="more menus." wordClassName="text-gradient" delay={0.25} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-cream/60">
              Roaster, café, green buyer or just curious: tell us what you're working on and we'll come back with
              samples, availability and pricing.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={mailto("Wholesale enquiry")}
                className="font-display text-2xl font-bold tracking-tight underline decoration-orange/50 decoration-2 underline-offset-8 transition hover:decoration-orange sm:text-3xl"
              >
                {site.email}
              </a>
              <button
                onClick={copyEmail}
                className="relative grid size-10 place-items-center rounded-full border border-white/15 text-cream/70 transition hover:border-white/30 hover:text-cream"
                aria-label="Copy email address"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "y" : "n"}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {copied ? <Check className="size-4 text-leaf" /> : <Copy className="size-4" />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>

            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-3 text-cream/70">
                  <span className="grid size-6 place-items-center rounded-full bg-orange/15 text-orange">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

function ContactForm() {
  const [role, setRole] = useState(roles[0]);
  const [picked, setPicked] = useState<string[]>([interests[0]]);
  const [status, setStatus] = useState<Status>("idle");

  function toggle(i: string) {
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const business = String(fd.get("business") ?? "");
    const email = String(fd.get("email") ?? "");
    const message = String(fd.get("message") ?? "");
    const isCustomer = role === "Past customer";

    const subject = isCustomer ? `Message from a VietCaPhe customer: ${name}` : `Wholesale enquiry: ${business || name}`;
    const lines = [
      `Name: ${name}`,
      business ? `Business: ${business}` : null,
      `Email: ${email}`,
      `I am a: ${role}`,
      !isCustomer && picked.length > 0 ? `Interested in: ${picked.join(", ")}` : null,
      "",
      message,
    ].filter((l): l is string => l !== null);

    if (site.formEndpoint) {
      setStatus("sending");
      try {
        const res = await fetch(site.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name, business, email, role, interests: picked, message, _subject: subject }),
        });
        if (!res.ok) throw new Error(String(res.status));
      } catch {
        window.location.href = mailto(subject, lines.join("\n"));
      }
    } else {
      window.location.href = mailto(subject, lines.join("\n"));
    }
    setStatus("sent");
  }

  return (
    <div className="beam-border relative rounded-[2rem] border border-white/10 bg-ink-2/80 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-9">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex min-h-[460px] flex-col items-center justify-center text-center"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
              className="grid size-16 place-items-center rounded-full bg-orange text-ink shadow-[0_0_40px_rgb(255_106_19/0.6)]"
            >
              <Check className="size-8" strokeWidth={3} />
            </motion.span>
            <h3 className="mt-6 font-display text-3xl font-bold tracking-tight">Thanks, we'll be in touch.</h3>
            <p className="mt-3 max-w-sm text-cream/60">
              {site.formEndpoint
                ? "Your message is on its way."
                : "Your email app should have opened with your message ready to send. If it didn't, email us directly at "}
              {!site.formEndpoint && (
                <a href={mailto("Wholesale enquiry")} className="text-amber underline-offset-4 hover:underline">
                  {site.email}
                </a>
              )}
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-8 text-sm font-medium text-cream/60 underline-offset-4 hover:text-cream hover:underline"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-5"
          >
            <fieldset>
              <legend className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/45">I am a</legend>
              <div className="flex flex-wrap gap-2">
                {roles.map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    aria-pressed={role === r}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      role === r ? "text-ink" : "text-cream/70 hover:text-cream"
                    }`}
                  >
                    {role === r && (
                      <motion.span
                        layoutId="role-pill"
                        className="absolute inset-0 rounded-full bg-orange"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <span
                      className={`absolute inset-0 rounded-full border ${role === r ? "border-transparent" : "border-white/12"}`}
                    />
                    <span className="relative">{r}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="sr-only">Your name</span>
                <input name="name" required placeholder="Your name" autoComplete="name" className={field} />
              </label>
              <label className="block">
                <span className="sr-only">Business</span>
                <input
                  name="business"
                  placeholder={role === "Past customer" ? "Business (optional)" : "Roastery / business"}
                  autoComplete="organization"
                  className={field}
                />
              </label>
            </div>
            <label className="block">
              <span className="sr-only">Email</span>
              <input name="email" type="email" required placeholder="Email address" autoComplete="email" className={field} />
            </label>

            <AnimatePresence initial={false}>
              {role !== "Past customer" && (
                <motion.fieldset
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className="overflow-hidden"
                >
                  <legend className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-cream/45">
                    Interested in
                  </legend>
                  <div className="flex flex-wrap gap-2 pb-1">
                    {interests.map((i) => {
                      const on = picked.includes(i);
                      return (
                        <button
                          type="button"
                          key={i}
                          onClick={() => toggle(i)}
                          aria-pressed={on}
                          className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-all ${
                            on
                              ? "border-orange/50 bg-orange/15 text-orange"
                              : "border-white/12 text-cream/60 hover:border-white/25 hover:text-cream"
                          }`}
                        >
                          <AnimatePresence initial={false}>
                            {on && (
                              <motion.span
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "auto", opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                              >
                                <Check className="size-3.5" strokeWidth={3} />
                              </motion.span>
                            )}
                          </AnimatePresence>
                          {i}
                        </button>
                      );
                    })}
                  </div>
                </motion.fieldset>
              )}
            </AnimatePresence>

            <label className="block">
              <span className="sr-only">Message</span>
              <textarea
                name="message"
                rows={4}
                placeholder={
                  role === "Past customer"
                    ? "How can we help?"
                    : "Tell us about your roastery, your blends and roughly how much green you go through."
                }
                className={`${field} resize-none`}
              />
            </label>

            <button
              type="submit"
              disabled={status === "sending"}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-orange px-6 py-4 font-semibold text-ink shadow-[0_10px_40px_-10px_rgb(255_106_19/0.8)] transition hover:bg-[#ff7a2b] disabled:opacity-60"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative flex items-center gap-2">
                {status === "sending" ? "Sending…" : role === "Past customer" ? "Send message" : "Send enquiry"}
                {role === "Past customer" ? (
                  <Send className="size-4 transition-transform group-hover:translate-x-0.5" />
                ) : (
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                )}
              </span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
