# Portfolio design system

> "A developer's field notebook on warm paper" — parchment canvas, quiet serif headlines,
> monospace for everything functional, one blue for the single thing to do on each screen.

Derived from two references on styles.refero.design, not cloned:

- **Primary: Monad** — parchment canvas, serif headings at weight 400 only, monospace as the UI voice, pill buttons, one accent.
- **Secondary: Anthropic** — never pure white surfaces (elevation by tonal shift), persistent underlines on inline links, no shadows.

Live reference page: `/design` (renders every token and component below).

## Colors

| Token         | Hex       | Role                                                                 |
| ------------- | --------- | -------------------------------------------------------------------- |
| `canvas`      | `#f6f3f1` | Page background. Never `#ffffff`.                                    |
| `surface`     | `#fbf9f7` | Cards, inputs, elevated panels — one tonal step lighter than canvas. |
| `surface-2`   | `#efeae5` | Image placeholders, grouped panels, code blocks.                     |
| `ink`         | `#1a1917` | Headings, primary text, dark button fill.                            |
| `graphite`    | `#4e4d4d` | Body copy, secondary text.                                           |
| `smoke`       | `#797776` | Helper text, eyebrows, inactive nav.                                 |
| `ash`         | `#cecac8` | All 1px borders and dividers. The border IS the structure.           |
| `accent`      | `#2b59d1` | Primary action only. One per screen.                                 |
| `accent-deep` | `#2349b0` | Hover/pressed state of `accent`.                                     |
| `accent-soft` | `#cfdaf5` | Focus rings, selected states, one highlighted word max.              |
| `danger`      | `#b4432c` | Destructive actions and errors only.                                 |

Light-only by design: the parchment canvas is the identity. No dark mode.

## Typography

| Font                 | Use                                                          | Weights        | Licence                           |
| -------------------- | ------------------------------------------------------------ | -------------- | --------------------------------- |
| **Instrument Serif** | Display and headings only. Never bold.                       | 400 (+ italic) | SIL OFL — free for commercial use |
| **JetBrains Mono**   | Everything else: body, nav, buttons, tags, labels, captions. | 400, 500       | SIL OFL — free for commercial use |

Type scale (minor third, 16px base):

| Role            | Size                       | Line-height | Tracking           | Font      |
| --------------- | -------------------------- | ----------- | ------------------ | --------- |
| Display         | 56px mobile / 80px desktop | 1.05        | −0.02em            | Serif 400 |
| Heading         | 40px                       | 1.15        | −0.02em            | Serif 400 |
| Heading-sm      | 28px                       | 1.2         | −0.01em            | Serif 400 |
| Subheading      | 22px                       | 1.3         | 0                  | Serif 400 |
| Body-lg         | 18px                       | 1.6         | 0                  | Mono 400  |
| Body            | 15px                       | 1.65        | 0                  | Mono 400  |
| Body-sm         | 13px                       | 1.6         | 0                  | Mono 400  |
| Eyebrow / label | 12px                       | 1.4         | +0.08em, uppercase | Mono 500  |

## Spacing & shape

- Base unit 8px. Page max-width 1120px, side padding 20px mobile / 40px desktop.
- Section gap 96px desktop / 64px mobile. Card padding 24–32px. Element gap 8–16px.
- Radius: pills `9999px` (buttons, tags), cards `24px`, image frames `16px`, inputs `12px`. Nothing under 12px.
- Elevation: **no box-shadow anywhere.** Use `ash` hairlines and the canvas → surface tonal step.

## Components

- **Primary pill button** — `accent` fill, `surface` text, mono 13px uppercase +0.08em, padding 12px 24px, radius 9999. Hover `accent-deep`. Trailing `→` allowed. **One per screen.**
- **Dark pill button** — `ink` fill, `canvas` text, same shape. For admin / non-marketing actions.
- **Ghost pill button** — transparent, 1px `ash` border, `ink` text. Hover: border becomes `ink`.
- **Inline link** — inherits color, persistent 1px underline, underline offset 3px. Hover: color `accent`. Never underline-on-hover-only.
- **Nav link** — mono 12px uppercase, `smoke`, hover `ink`, no underline.
- **Card** — `surface` fill, 1px `ash` border, radius 24, padding 24. Title serif 22–28px, body mono 15px.
- **Tag** — 1px `ash` border, transparent fill, mono 12px uppercase, radius 9999, padding 4px 10px.
- **Input** — `surface` fill, 1px `ash` border, radius 12, padding 10px 14px, mono 15px. Focus: 2px `accent-soft` ring + `accent` border.
- **Eyebrow** — mono 12px uppercase `smoke`, sits above a serif heading, 12px gap.
- **Section** — eyebrow + serif heading + optional mono lede, then content. Hairline `ash` divider between sections.

## Do

- Headings in Instrument Serif at 400 — let size and tracking carry weight.
- Body, nav, buttons, tags in JetBrains Mono — monospace is the voice.
- Parchment canvas, surface one step lighter, hairline borders, zero shadows.
- Exactly one `accent` element per screen: the thing the visitor should do.
- Every section: one idea, one action, fits roughly one viewport.
- Persistent underlines on links inside prose.

## Don't

- No bold headings, no sans-serif body text.
- No `#ffffff`, no gradients, no glassmorphism, no glow, no drop shadow.
- No blue outside the single primary action. No second accent color.
- No radius under 12px. No sharp corners.
- No emoji as icons. No stock imagery. No three-feature-card hero grid.
- No "Welcome to my portfolio" / "passionate about" copy — see the copy rules in `~/projets/MANUEL-SITE-WEB.md`.
