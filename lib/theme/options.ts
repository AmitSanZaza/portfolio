// The three theme axes and their allowed values. Shared by the pre-paint
// init script, the picker on /design, and the CSS (see globals.css).

export const THEMES = ["system", "light", "dark"] as const;
export const PAPERS = ["kraft", "stone", "sand"] as const;
export const ACCENTS = ["lake", "clay", "forest", "plum", "ink"] as const;

export type Theme = (typeof THEMES)[number];
export type Paper = (typeof PAPERS)[number];
export type Accent = (typeof ACCENTS)[number];

export const STORAGE_KEYS = {
  theme: "portfolio:theme",
  paper: "portfolio:paper",
  accent: "portfolio:accent",
} as const;

// Light / dark hex per accent, for the swatch dots only — the real values
// live in globals.css.
export const ACCENT_PREVIEW: Record<Accent, { light: string; dark: string }> = {
  lake: { light: "#2b59d1", dark: "#8fb0f5" },
  clay: { light: "#a83d24", dark: "#f0917a" },
  forest: { light: "#2f6b3f", dark: "#8fd3a3" },
  plum: { light: "#6d3a9c", dark: "#c9a6f2" },
  ink: { light: "#1a1917", dark: "#f1ece5" },
};

export const PAPER_PREVIEW: Record<Paper, string> = {
  kraft: "#ebe5dc",
  stone: "#e7e5e1",
  sand: "#efe5d0",
};
