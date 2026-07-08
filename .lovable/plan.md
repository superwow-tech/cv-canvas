# Typography Refinement Plan

Goal: elevate the portfolio's typographic voice so it reads as editorial and confident on desktop, and calm and rhythmic on mobile — without changing colors, layout, or content.

## Direction

Pair a **display serif** with the existing **Rubik** sans:

- **Instrument Serif** — used for the hero name, section headings, and the bio's opening. High-contrast, editorial, gives the site an art-direction feel that matches the "bold, dramatic, story-driven" tone.
- **Rubik** — kept for all UI, body, meta, pills, timeline text. Retuned weights and tracking.

Rationale: currently every text element is Rubik at similar weights, so hierarchy relies only on size. A serif display face creates instant contrast between "voice" (serif) and "information" (sans), which is the standard move for editorial portfolios.

## Scale (desktop → mobile via `clamp`)

| Role                 | Font                  | Size (clamp)              | Weight | Tracking | Leading |
| -------------------- | --------------------- | ------------------------- | ------ | -------- | ------- |
| Hero name            | Instrument Serif      | `clamp(3.5rem,13vw,9rem)` | 400    | -0.03em  | 0.9     |
| Hero title           | Rubik uppercase       | `clamp(0.8rem,1.6vw,1rem)`| 500    | 0.28em   | 1.4     |
| Contact / actions    | Rubik                 | 14 → 15px                 | 400    | 0        | 1.5     |
| Bio paragraph        | Instrument Serif      | `clamp(1.5rem,3.2vw,2.4rem)` italic optional first line | 400 | -0.01em | 1.35 |
| Section heading      | Instrument Serif      | `clamp(1.75rem,4vw,2.75rem)` | 400 | -0.02em | 1.1 |
| Section eyebrow (optional retain) | Rubik uppercase | 11 → 12px            | 500    | 0.32em   | 1.3     |
| Timeline title       | Rubik                 | `clamp(1.05rem,1.6vw,1.35rem)` | 600 | -0.01em | 1.3 |
| Timeline subtitle    | Rubik                 | 14 → 16px                 | 400    | 0        | 1.5     |
| Timeline meta (date) | Rubik uppercase       | 11 → 12px                 | 500    | 0.18em   | 1.4     |
| Bullets / body       | Rubik                 | 15 → 16px                 | 400    | 0        | 1.65    |
| Pills                | Rubik                 | 11 → 12px                 | 500    | 0.02em   | 1       |
| Language name        | Instrument Serif      | 20 → 26px                 | 400    | -0.01em  | 1.2     |

Mobile improvements baked in:

- Hero name drops from 11vw to 13vw floor of 3.5rem so it never overflows narrow phones (currently clips at 402px).
- Bio paragraph loses "text-2xl" jump and instead scales fluidly, gaining line-height on small screens.
- Section headings switch from all-caps 12px labels to a proper serif headline, so mobile hierarchy no longer collapses into "everything looks like a label".
- Body copy floors at 15px (never 13px) so it stays readable on phones.

## Section-level changes

**HeroSection.tsx**
- Name → Instrument Serif, mixed-case (not uppercase). Keeps drama, drops shoutiness.
- Title → shorter tracking on mobile, wider on desktop.
- Contact block: monospace-like alignment via `tabular-nums` for phone.

**BioSection.tsx**
- Serif, larger fluid size, `text-balance` retained, add `first-letter` treatment only if it renders cleanly (optional; default off).

**ContentSection.tsx**
- `SectionHeading` becomes a two-line composition: small Rubik eyebrow ("01 / Experience") + serif headline. Divider lines kept.
- Timeline titles use tighter tracking and heavier weight for scan-ability.
- Meta dates use `tabular-nums` and tighter uppercase tracking.
- Pills get slightly more padding + uppercase for consistency.

## Technical notes

- Install fonts via `bun add @fontsource/instrument-serif` (weights 400) and ensure Rubik is loaded via `@fontsource/rubik` (400, 500, 600) instead of the Google `<link>` in `index.html` (leave the link in place for now; add fontsource so Tailwind can rely on it locally too).
- Register families in `tailwind.config.ts`:
  - `serif: ["'Instrument Serif'", "ui-serif", "Georgia", "serif"]`
  - keep existing `sans` chain but ensure `Rubik` is first.
- Replace hard-coded `font-['Rubik']` classes with `font-sans` / `font-serif` utilities so the system is centralized.
- Add utility helpers in `src/index.css` for `.text-eyebrow`, `.text-display`, `.tabular-nums` if useful.
- Update `src/lib/generate-cv.ts` is **not** in scope — PDF keeps its current DejaVu font.

## Files to touch

- `src/main.tsx` — import `@fontsource/instrument-serif` and `@fontsource/rubik` weights.
- `tailwind.config.ts` — add `serif` family, ensure Rubik in `sans`.
- `src/index.css` — add fluid type utilities + `tabular-nums` helper.
- `src/components/sections/HeroSection.tsx` — name/title/contact type.
- `src/components/sections/BioSection.tsx` — serif fluid paragraph.
- `src/components/sections/ContentSection.tsx` — headings, timeline, pills, languages.
- `package.json` / lockfile — new fontsource deps.

## Out of scope

- Colors, spacing rhythm beyond what the new scale implies, animations, layout structure, CV PDF typography.

## Verification

- `bun run build` succeeds.
- Playwright screenshots at 1280×1800 and 402×717 to confirm hero fits, bio reads, section headings render in serif, no font-swap flash.
