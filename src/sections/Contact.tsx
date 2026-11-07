import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Copy, Send } from "lucide-react";
import { Reveal, SplitText, ease } from "../components/motion";
import { mailto, site } from "../config";

const roles = ["Roaster", "Green buyer", "Past customer", "Other"];
const interests = ["Honey processed (flagship)", "Gia Lai micro-lots", "Anaerobic lots", "Community lots"];
const perks = [
  "Green samples for roasters",
  "Traceable to province and process",
  "Straight answers on availability",
  "Past customers welcome too",
];

const field =
  "w-full rounded-2xl border-2 border-ink/10 bg-white px-4 py-3.5 text-ink placeholder:text-ink/40 outline-none transition focus:border-ink";

type Status = "idle" | "sending" | "sent";

export function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    await navigator.clipboard.writeText(site.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section
      id="contact"
      className="relative -mt-16 rounded-t-[2.5rem] bg-ink pb-36 pt-24 text-cream sm:-mt-20 sm:rounded-t-[3.5rem] sm:pb-44 sm:pt-32"
    >
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          <h2 className="font-display text-[clamp(2.8rem,6vw,5.75rem)] font-extrabold leading-[0.92] tracking-[-0.04em]">
            <SplitText text="Let's put robusta on" /> <SplitText text="more menus." wordClassName="text-orange" delay={0.25} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-cream/70">
              Roasting robusta, or thinking about it? Tell us about your roastery and we'll come back with green
              samples, availability and pricing.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={mailto("Wholesale enquiry")}
                className="font-display text-2xl font-bold tracking-tight text-yellow underline decoration-2 underline-offset-8 transition hover:text-orange sm:text-3xl"
              >
                {site.email}
              </a>
              <button
                onClick={copyEmail}
                className="grid size-10 place-items-center rounded-full bg-cream/10 text-cream transition hover:bg-cream hover:text-ink"
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
                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>

            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-3 text-cream/80">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-orange text-ink">
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
  const isCustomer = role === "Past customer";

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
    const website = String(fd.get("website") ?? "");

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
        // Sent as text/plain so the browser skips the CORS preflight, which Apps Script can't answer.
        const res = await fetch(site.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            name,
            business,
            email,
            role,
            interests: isCustomer ? [] : picked,
            message,
            subject,
            website,
          }),
        });
        const result = (await res.json()) as { ok?: boolean };
        if (!res.ok || !result.ok) throw new Error(String(res.status));
      } catch {
        window.location.href = mailto(subject, lines.join("\n"));
      }
    } else {
      window.location.href = mailto(subject, lines.join("\n"));
    }
    setStatus("sent");
  }

  return (
    <div className="rounded-[2rem] bg-cream p-6 text-ink sm:p-9">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex min-h-[460px] flex-col items-center justify-center text-center"
          >
            <motion.span
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
              className="grid size-16 place-items-center rounded-full bg-orange text-ink"
            >
              <Check className="size-8" strokeWidth={3} />
            </motion.span>
            <h3 className="mt-6 font-display text-3xl font-bold tracking-tight">Thanks, we'll be in touch.</h3>
            <p className="mt-3 max-w-sm text-ink/70">
              {site.formEndpoint
                ? "Your message is on its way."
                : "Your email app should have opened with your message ready to send. If it didn't, email us directly at "}
              {!site.formEndpoint && (
                <a href={mailto("Wholesale enquiry")} className="font-semibold underline underline-offset-4">
                  {site.email}
                </a>
              )}
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-8 text-sm font-semibold text-ink/60 underline-offset-4 hover:text-ink hover:underline"
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
              <legend className="mb-3 font-semibold">I am a…</legend>
              <div className="flex flex-wrap gap-2">
                {roles.map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    aria-pressed={role === r}
                    className={`relative rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                      role === r ? "border-ink text-cream" : "border-ink/15 text-ink/75 hover:border-ink/40 hover:text-ink"
                    }`}
                  >
                    {role === r && (
                      <motion.span
                        layoutId="role-pill"
                        className="absolute -inset-0.5 rounded-full bg-ink"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
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
                  placeholder={isCustomer ? "Business (optional)" : "Roastery / business"}
                  autoComplete="organization"
                  className={field}
                />
              </label>
            </div>
            <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
            <label className="block">
              <span className="sr-only">Email</span>
              <input name="email" type="email" required placeholder="Email address" autoComplete="email" className={field} />
            </label>

            <AnimatePresence initial={false}>
              {!isCustomer && (
                <motion.fieldset
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className="overflow-hidden"
                >
                  <legend className="mb-3 font-semibold">Interested in</legend>
                  <div className="flex flex-wrap gap-2 pb-1">
                    {interests.map((i) => {
                      const on = picked.includes(i);
                      return (
                        <button
                          type="button"
                          key={i}
                          onClick={() => toggle(i)}
                          aria-pressed={on}
                          className={`flex items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-sm font-semibold transition-all ${
                            on ? "border-orange bg-orange text-ink" : "border-ink/15 text-ink/70 hover:border-ink/40 hover:text-ink"
                          }`}
                        >
                          {on && <Check className="size-3.5" strokeWidth={3} />}
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
                  isCustomer
                    ? "How can we help?"
                    : "Tell us about your roastery, your blends and roughly how much green you go through."
                }
                className={`${field} resize-none`}
              />
            </label>

            <button
              type="submit"
              disabled={status === "sending"}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-orange px-6 py-4 text-lg font-bold text-ink transition hover:-translate-y-0.5 hover:bg-[#ff7d33] disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : isCustomer ? "Send message" : "Send enquiry"}
              {isCustomer ? (
                <Send className="size-4 transition-transform group-hover:translate-x-0.5" />
              ) : (
                <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
