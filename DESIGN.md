# Weather Web — Design System v2

> Reference: **everyday.io** (siteinspire) — minimal, architectural, editorial.
> We borrow the *design language* only (not a clone), adapted to our weather **data dashboard** tone.

---

## 1. Design language (what we borrowed)

- **Warm-neutral, architectural calm** — concrete / bone-white canvas, near-black ink text, restrained accent. No loud colors competing.
- **Editorial hierarchy** — big confident numbers and headings, tiny uppercase eyebrow labels, generous whitespace and vertical rhythm.
- **Flat, hairline surfaces** — cards separated by a 1px warm border + a whisper shadow, not heavy drop shadows. Feels like precise hardware.
- **Ink as the primary action** — buttons and active states are charcoal/near-black (everyday's CTA style), not a bright accent.
- **One warm + one cool accent, used sparingly** — clay (hot) and slate-teal (cool) appear only on temperature chips, keeping a subtle weather warmth.
- **The `^` caret motif** — used in the wordmark (`Weather^`) as a signature detail.

## 2. Layout

- Single centered column, **max-width 680px**, outer padding 24–32px (our dashboard stays a focused column, not a 3-region marketing page).
- Vertical rhythm: sections separated by **24px**; inside cards padding **24px**.
- Header: wordmark left, unit/theme controls right (wraps on narrow widths).
- Nav: minimal horizontal pill bar; active item = ink pill.
- Breakpoints: ≥680px full padding; <680px column padding shrinks to 16px, nav scrolls horizontally, stat tiles wrap 2-per-row.

## 3. Color tokens

### Neutral (warm)
| Token | Hex | Use |
|-------|-----|-----|
| `--bg-panel` | `#EDEAE3` | Page background (warm concrete) |
| `--bg-canvas` | `#F3F1EB` | Alt surface |
| `--bg-muted` | `#E6E2D9` | Inputs, subtle fills |
| `--surface` | `#FAF8F4` | Card surface (warm white) |
| `--text-primary` | `#1B1C19` | Numbers, body |
| `--text-heading` | `#232420` | Headings |
| `--text-secondary` | `#6E6A60` | Labels, captions |
| `--text-placeholder` | `#A9A497` | Placeholder |
| `--border` | `#DEDACF` | Hairline card/input border |

### Action & accent
| Token | Hex | Use |
|-------|-----|-----|
| `--accent` (ink) | `#1E1F1B` | Primary buttons, active nav, links, highlights |
| `--accent-soft` | `#E5E1D7` | Neutral chip / status fill |
| `--warm` | `#B4552B` | "Hot" chip text (clay) |
| `--warm-soft` | `#F0E1D6` | "Hot" chip background |
| `--cool` | `#4E6E7A` | "Cool" chip text (slate-teal) |
| `--cool-soft` | `#E2E8EA` | "Cool" chip background |

### Dark theme
| Token | Hex |
|-------|-----|
| `--dk-canvas` | `#1A1B18` |
| `--dk-surface` | `#232420` |
| `--dk-border` | `#34352F` |
| `--dk-text` | `#ECEAE3` |
| `--dk-text-sec` | `#A6A192` |

## 4. Typography

- **Body / labels**: `Inter` — clean neutral grotesque.
- **Display / numbers / headings**: `Space Grotesk` — geometric, technical, architectural feel; tight tracking.

| Role | Size | Weight | Tracking |
|------|------|--------|----------|
| Wordmark / hero number | 32–40px | 700 | -0.02em |
| Section heading | 18–20px | 600 | -0.01em |
| Card temperature | 34px | 700 | -0.02em |
| Body | 14px | 400 | 0 |
| Eyebrow / label | 11–12px | 600 | 0.04em, UPPERCASE |

Line-height: 1.15 for numbers/headings, 1.5 for body.

## 5. Components

- **Radius**: card 18px · chip 12px · button 10px · input 10px.
- **Shadow**: `--shadow-card = 0 0 0 1px var(--border), 0 2px 6px rgba(27,28,25,.04)` (hairline + whisper). Flat, no glow.
- **Buttons**: primary = ink fill, white text, 10px radius, hover darkens slightly; ghost = muted fill, hover ink-tint. Transitions 180ms ease.
- **Cards**: warm-white surface, hairline border, generous padding. Hover on interactive cards: lift 2px + slightly stronger hairline.
- **Chips**: soft warm/cool tints for temperature state; neutral fill elsewhere.
- **Inputs**: muted fill, hairline border, focus = ink border + soft ring.

## 6. Interaction

- Transition timing: **180ms ease** for color/background, **120ms** for transforms.
- Hover: buttons darken; nav links get muted fill; weather cards lift 2px.
- Active nav: ink pill (filled).
- Icons: emoji kept minimal as quiet labels, never as loud decoration.

## 7. Do / Don't
- ✅ Lead each card with one dominant number; keep labels tiny and muted.
- ✅ Reserve color for temperature chips only; everything else stays neutral ink.
- ✅ Prefer hairline borders + whitespace over heavy shadows.
- ❌ Don't use bright competing accents or glow shadows.
- ❌ Don't change component structure, data, or logic — restyle only.
