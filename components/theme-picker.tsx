"use client";

import { useSyncExternalStore } from "react";
import {
  PALETTES,
  STORAGE_KEYS,
  THEMES,
  type Accent,
  type Paper,
  type Theme,
} from "@/lib/theme/options";

type Snapshot = { theme: Theme; paper: Paper; accent: Accent; isDark: boolean };
const DEFAULTS: Snapshot = {
  theme: "system",
  paper: "kraft",
  accent: "lake",
  isDark: false,
};
const EVENT = "portfolio:theme-change";

// <html> data attributes are the source of truth (theme-init.tsx sets them
// before paint). This store reads them back so the controls show state.
let last: Snapshot = DEFAULTS;
function getSnapshot(): Snapshot {
  const d = document.documentElement;
  const theme = (d.getAttribute("data-theme") ?? "system") as Theme;
  const paper = (d.getAttribute("data-paper") ?? "kraft") as Paper;
  const accent = (d.getAttribute("data-accent") ?? "lake") as Accent;
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
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

function setAxis(
  attr: string,
  key: string,
  value: string,
  defaultValue: string,
) {
  const d = document.documentElement;
  if (value === defaultValue) d.removeAttribute(attr);
  else d.setAttribute(attr, value);
  try {
    if (value === defaultValue) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage blocked — the choice still applies to this page.
  }
}
function commit() {
  window.dispatchEvent(new Event(EVENT));
}

const setTheme = (v: Theme) => {
  setAxis("data-theme", STORAGE_KEYS.theme, v, "system");
  commit();
};
const setPalette = (paper: Paper, accent: Accent) => {
  setAxis("data-paper", STORAGE_KEYS.paper, paper, "kraft");
  setAxis("data-accent", STORAGE_KEYS.accent, accent, "lake");
  commit();
};

// Click a palette → the whole site takes it, immediately and on next load.
export function ThemePicker() {
  const { theme, paper, accent, isDark } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => DEFAULTS,
  );

  return (
    <div className="card flex flex-col gap-8 p-6 sm:p-8">
      <div className="flex flex-col gap-2">
        <p className="eyebrow">Pick a palette</p>
        <h2 className="text-[28px] leading-[1.2]">
          Click one — the whole site takes it
        </h2>
        <p className="max-w-xl text-[14px] text-graphite">
          Each palette is a paper tone plus the one accent color. Saved in this
          browser and applied before the next page paints.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {PALETTES.map((p) => {
          const c = isDark ? p.dark : p.light;
          const pressed = p.paper === paper && p.accent === accent;
          return (
            <button
              key={p.id}
              type="button"
              className="palette"
              aria-pressed={pressed}
              onClick={() => setPalette(p.paper, p.accent)}
            >
              <span className="palette-strip" aria-hidden>
                <span style={{ background: c.canvas }} />
                <span style={{ background: c.surface }} />
                <span style={{ background: c.ink }} />
                <span style={{ background: c.accent }} />
              </span>
              <span className="palette-name">{p.name}</span>
              <span className="palette-meta">
                {pressed ? "Applied" : "Apply"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <span className="eyebrow">Theme</span>
        <div className="segmented" role="group" aria-label="Theme">
          {THEMES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={theme === t}
              onClick={() => setTheme(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Live specimen — rendered from the real tokens, so it changes the
          instant a palette is clicked. */}
      <div className="rounded-frame border border-ash bg-canvas p-5">
        <p className="eyebrow mb-3">Live preview</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="btn btn-primary">Primary action</span>
          <span className="btn btn-ghost">Secondary</span>
          <span className="tag">Tag</span>
          <span className="text-[14px]">
            Body text with a{" "}
            <a href="#top" className="link">
              link
            </a>
            .
          </span>
        </div>
      </div>
    </div>
  );
}
