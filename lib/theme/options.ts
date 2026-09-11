// The theme axes and their allowed values. Shared by the pre-paint init
// script, the picker on /design, and the CSS (see globals.css).

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

// A palette is one paper + one accent. Hex values here are for the strip
// previews only — the real tokens live in globals.css.
export type Palette = {
  id: string;
  name: string;
  paper: Paper;
  accent: Accent;
  light: { canvas: string; surface: string; ink: string; accent: string };
  dark: { canvas: string; surface: string; ink: string; accent: string };
};

const DARK_BASE = { canvas: "#000000", surface: "#121110", ink: "#f1ece5" };
const PAPER_HEX: Record<Paper, { canvas: string; surface: string }> = {
  kraft: { canvas: "#ebe5dc", surface: "#f3eee7" },
  stone: { canvas: "#e7e5e1", surface: "#f0eeeb" },
  sand: { canvas: "#efe5d0", surface: "#f6efe0" },
};
const ACCENT_HEX: Record<Accent, { light: string; dark: string }> = {
  lake: { light: "#2b59d1", dark: "#8fb0f5" },
  clay: { light: "#a83d24", dark: "#f0917a" },
  forest: { light: "#2f6b3f", dark: "#8fd3a3" },
  plum: { light: "#6d3a9c", dark: "#c9a6f2" },
  ink: { light: "#1a1917", dark: "#f1ece5" },
};

function palette(
  id: string,
  name: string,
  paper: Paper,
  accent: Accent,
): Palette {
  return {
    id,
    name,
    paper,
    accent,
    light: {
      ...PAPER_HEX[paper],
      ink: "#1a1917",
      accent: ACCENT_HEX[accent].light,
    },
    dark: { ...DARK_BASE, accent: ACCENT_HEX[accent].dark },
  };
}

export const PALETTES: Palette[] = [
  palette("lake-kraft", "Lake on kraft", "kraft", "lake"),
  palette("clay-sand", "Clay on sand", "sand", "clay"),
  palette("forest-stone", "Forest on stone", "stone", "forest"),
  palette("plum-kraft", "Plum on kraft", "kraft", "plum"),
  palette("ink-stone", "Ink on stone", "stone", "ink"),
  palette("lake-sand", "Lake on sand", "sand", "lake"),
];
