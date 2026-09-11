import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Design system — Amit Barua",
  description: "The tokens and components this site is built from.",
};

const colors = [
  { name: "canvas", hex: "#f6f3f1", role: "Page background. Never white." },
  { name: "surface", hex: "#fbf9f7", role: "Cards, inputs, panels." },
  {
    name: "surface-2",
    hex: "#efeae5",
    role: "Image placeholders, grouped panels.",
  },
  { name: "ink", hex: "#1a1917", role: "Headings, primary text." },
  { name: "graphite", hex: "#4e4d4d", role: "Body copy." },
  { name: "smoke", hex: "#6b6966", role: "Helper text, eyebrows." },
  { name: "ash", hex: "#cecac8", role: "Every 1px border." },
  { name: "ash-strong", hex: "#8a8681", role: "Input borders (3:1)." },
  { name: "accent", hex: "#2b59d1", role: "The one action per screen." },
  { name: "accent-deep", hex: "#2349b0", role: "Accent hover." },
  { name: "accent-soft", hex: "#cfdaf5", role: "Focus ring, selection." },
  { name: "danger", hex: "#b4432c", role: "Destructive actions, errors." },
];

const rules = {
  do: [
    "Headings in Instrument Serif, weight 400 — size carries the weight.",
    "Body, nav, buttons and tags in JetBrains Mono — monospace is the voice.",
    "Parchment canvas, surface one tonal step lighter, hairline borders, zero shadows.",
    "Exactly one accent element per screen: the thing the visitor should do.",
    "One idea and one action per section; each fits roughly one viewport.",
    "Persistent underlines on links inside prose.",
  ],
  dont: [
    "No bold headings. No sans-serif body text.",
    "No #ffffff, no gradients, no glassmorphism, no glow, no drop shadow.",
    "No blue outside the single primary action. No second accent.",
    "No radius under 12px. No sharp corners.",
    "No emoji as icons. No stock imagery. No three-feature-card hero grid.",
    "No “welcome to my portfolio” or “passionate about” copy.",
  ],
};

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-ash py-14 first:border-t-0">
      <div className="mb-8 flex flex-col gap-2">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="text-[28px] leading-[1.2]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function DesignPage() {
  return (
    <div className="container-page py-16 sm:py-24">
      <PageHeader eyebrow="How this site is built" title="Design system" />
      <p className="mb-6 max-w-2xl text-[17px] leading-relaxed">
        A developer&apos;s field notebook on warm paper. Derived from two
        references — Monad for the parchment-serif-mono voice, Anthropic for
        tonal elevation and persistent underlines — then made our own. Source of
        truth: <code className="text-ink">DESIGN.md</code> at the repo root.
      </p>

      <Section eyebrow="01" title="Colors">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {colors.map((c) => (
            <li key={c.name} className="card overflow-hidden">
              <div
                className="h-20 border-b border-ash"
                style={{ background: c.hex }}
              />
              <div className="flex flex-col gap-1 p-4 text-[12px]">
                <span className="text-ink">{c.name}</span>
                <span className="text-smoke">{c.hex}</span>
                <span className="pt-1 text-graphite">{c.role}</span>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="02" title="Typography">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="eyebrow">
              Display · Instrument Serif 400 · clamp(44px, 8vw, 80px)
            </p>
            <p className="display">The quick brown fox</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="eyebrow">Heading · 40px · −0.02em</p>
            <p className="font-serif text-[40px] leading-[1.15] tracking-[-0.02em] text-ink">
              Jumps over the lazy dog
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="eyebrow">Heading-sm · 28px</p>
            <p className="font-serif text-[28px] leading-[1.2] tracking-[-0.02em] text-ink">
              And keeps running
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="eyebrow">Body · JetBrains Mono 400 · 16px / 1.65</p>
            <p className="max-w-xl">
              Body copy is set in a monospace face on purpose: it reads as
              written by someone who spends the day in an editor. Inline links
              carry a{" "}
              <a href="#" className="link">
                persistent underline
              </a>
              , never a hover-only one.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="eyebrow">Eyebrow · 12px · uppercase · +0.08em</p>
            <p className="eyebrow">Selected work</p>
          </div>
        </div>
      </Section>

      <Section eyebrow="03" title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn btn-primary">
            Primary <span aria-hidden>→</span>
          </button>
          <button className="btn btn-dark">Dark</button>
          <button className="btn btn-ghost">Ghost</button>
          <button className="btn btn-primary" disabled>
            Disabled
          </button>
        </div>
        <p className="mt-4 max-w-xl text-[13px] text-smoke">
          Pill only. Primary appears once per screen; dark is for admin actions;
          ghost is the secondary choice next to a primary.
        </p>
      </Section>

      <Section eyebrow="04" title="Card, tags, input">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <article className="card p-3">
            <div className="flex aspect-[16/10] items-center justify-center rounded-frame bg-surface-2">
              <span className="eyebrow">Image frame · 16px</span>
            </div>
            <div className="flex flex-col gap-3 px-3 pb-3 pt-5">
              <h3 className="text-[26px] leading-[1.2]">Card title</h3>
              <p className="text-[14px] text-graphite">
                Surface fill, 1px ash border, 24px radius, no shadow. The border
                is the structure.
              </p>
              <ul className="flex flex-wrap gap-2">
                <li className="tag">Next.js</li>
                <li className="tag">TypeScript</li>
              </ul>
            </div>
          </article>
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2 text-[13px] text-ink">
              Input
              <input
                className="input"
                placeholder="12px radius, accent focus ring"
              />
            </label>
            <label className="flex flex-col gap-2 text-[13px] text-ink">
              Textarea
              <textarea className="input" rows={3} placeholder="Same rules" />
            </label>
          </div>
        </div>
      </Section>

      <Section eyebrow="05" title="Do / Don’t">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="card p-6">
            <p className="eyebrow mb-4 !text-ink">Do</p>
            <ul className="flex flex-col gap-3 text-[14px]">
              {rules.do.map((r) => (
                <li key={r} className="flex gap-3">
                  <span aria-hidden className="text-accent">
                    +
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <p className="eyebrow mb-4 !text-danger">Don’t</p>
            <ul className="flex flex-col gap-3 text-[14px]">
              {rules.dont.map((r) => (
                <li key={r} className="flex gap-3">
                  <span aria-hidden className="text-danger">
                    −
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
}
