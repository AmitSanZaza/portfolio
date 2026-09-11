"use client";

import { useSyncExternalStore } from "react";
import {
  ACCENTS,
  ACCENT_PREVIEW,
  PAPERS,
  PAPER_PREVIEW,
  STORAGE_KEYS,
  THEMES,
  type Accent,
  type Paper,
  type Theme,
} from "@/lib/theme/options";

type Snapshot = {
  theme: Theme;
  paper: Paper;
  accent: Accent;
  isDark: boolean;
};

const DEFAULTS: Snapshot = {
  theme: "system",
  paper: "kraft",
  accent: "lake",
  isDark: false,
};

const EVENT = "portfolio:theme-change";

// The <html> data attributes are the source of truth (theme-init.tsx sets
// them before paint). This store just reads them back for the UI.
function getSnapshot(): Snapshot {
  const d = document.documentElement;
  const theme = (d.getAttribute("data-theme") ?? "system") as Theme;
  const paper = (d.getAttribute("data-paper") ?? "kraft") as Paper;
  const accent = (d.getAttribute("data-accent") ?? "lake") as Accent;
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  return cached(theme, paper, accent, isDark);
}

// useSyncExternalStore needs a stable object for unchanged state.
let last: Snapshot = DEFAULTS;
function cached(theme: Theme, paper: Paper, accent: Accent, isDark: boolean) {
  if (
    last.theme !== theme ||
    last.paper !== paper ||
    last.accent !== accent ||
    last.isDark !== isDark
  ) {
    last = { theme, paper, accent, isDark };
  }
  return last;
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    mq.removeEventListener("change", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

function apply(attr: string, key: string, value: string, defaultValue: string) {
  const d = document.documentElement;
  if (value === defaultValue) d.removeAttribute(attr);
  else d.setAttribute(attr, value);
  try {
    if (value === defaultValue) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage blocked (private mode) — the choice still applies for this page.
  }
  window.dispatchEvent(new Event(EVENT));
}

const pickTheme = (v: Theme) =>
  apply("data-theme", STORAGE_KEYS.theme, v, "system");
const pickPaper = (v: Paper) =>
  apply("data-paper", STORAGE_KEYS.paper, v, "kraft");
const pickAccent = (v: Accent) =>
  apply("data-accent", STORAGE_KEYS.accent, v, "lake");

// Restyles the whole site live. Choices persist in localStorage and are
// replayed before paint on the next load by theme-init.tsx.
export function ThemePicker() {
  const { theme, paper, accent, isDark } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => DEFAULTS,
  );

  return (
    <div className="card flex flex-col gap-8 p-6 sm:p-8">
      <div className="flex flex-col gap-2">
        <p className="eyebrow">Try it</p>
        <h2 className="text-[28px] leading-[1.2]">
          These controls restyle the whole site
        </h2>
        <p className="max-w-xl text-[14px] text-graphite">
          Pick a theme, a paper tone and the one accent color. Your choice is
          saved in this browser and applied before the next page paints.
        </p>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="eyebrow mb-3">Theme</legend>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              type="button"
              className="swatch"
              aria-pressed={theme === t}
              onClick={() => pickTheme(t)}
            >
              <span
                className="swatch-dot"
                style={{
                  background:
                    t === "dark"
                      ? "#000"
                      : t === "light"
                        ? PAPER_PREVIEW[paper]
                        : "linear-gradient(90deg, #ebe5dc 50%, #000 50%)",
                }}
                aria-hidden
              />
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="eyebrow mb-3">Paper (light theme)</legend>
        <div className="flex flex-wrap gap-2">
          {PAPERS.map((p) => (
            <button
              key={p}
              type="button"
              className="swatch"
              aria-pressed={paper === p}
              onClick={() => pickPaper(p)}
            >
              <span
                className="swatch-dot"
                style={{ background: PAPER_PREVIEW[p] }}
                aria-hidden
              />
              {p}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="eyebrow mb-3">Accent — the one action color</legend>
        <div className="flex flex-wrap gap-2">
          {ACCENTS.map((a) => (
            <button
              key={a}
              type="button"
              className="swatch"
              aria-pressed={accent === a}
              onClick={() => pickAccent(a)}
            >
              <span
                className="swatch-dot"
                style={{
                  background: isDark
                    ? ACCENT_PREVIEW[a].dark
                    : ACCENT_PREVIEW[a].light,
                }}
                aria-hidden
              />
              {a}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            pickTheme("system");
            pickPaper("kraft");
            pickAccent("lake");
          }}
        >
          Reset to defaults
        </button>
      </div>
    </div>
  );
}
