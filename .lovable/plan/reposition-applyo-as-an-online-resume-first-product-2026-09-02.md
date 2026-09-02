# Reposition Applyo as an online resume-first product

## UX diagnosis

Right now the landing page sells PDF export: the hero CTA is "Build my resume free", the Templates section has paper-size pickers, margin sliders, and a big "Export PDF" button, and the How-it-works step 3 is "Export and apply". That over-invests in a feature that is secondary to the actual product — a shareable, portfolio-quality online resume page like `/example`.

The stronger pitch is: **build a beautiful online resume page and optionally download it as a PDF**. That keeps the landing page focused, removes decision fatigue, and makes the `/example` page the star of the show.

## What we change

### 1. Hero: online resume as the primary outcome
- Swap the hero CTA hierarchy so "See a live sample resume" is the primary button and "Start building" is secondary.
- Rewrite the subhead and JSON-LD description to emphasize the shareable resume page, with PDF as a bonus.

### 2. How it works: three steps that match the real flow
1. Fill in the wizard
2. Pick a design
3. Share your page — or download a PDF

### 3. Templates section: preview-only on the landing page
- Remove paper-size buttons, margin sliders, and the "Export PDF" button from `TemplatesSection` when it is rendered on `/`.
- Keep template cards as a quick way to browse designs and open the preview modal.
- Keep the "See the sample resume" link, but make it the dominant action in the section header (larger, primary-styled button).
- Add a short line below the heading explaining that every design also exports to print-ready PDF.

### 4. Example page: clean, shareable resume demo
- Keep `HeroSection`, `BioSection`, and `ContentSection`.
- Remove `TemplatesSection` from `/example`; the sample resume should feel like a real page a recruiter would visit, not a template browser.
- Keep the existing "Download CV" button in the hero — it proves the PDF works without competing with the main product.

### 5. Pricing: reflect the online-first value
- Update Free/Pro feature lists to lead with online resume pages, then PDF exports.
- Remove A4/Letter and adjustable margins from the marketing copy; those are implementation details that can live in the editor.

### 6. Navigation
- Rename header link "Example" to "Sample resume" so the product promise is visible in the nav.

### 7. Editor/dashboard: keep PDF export where it belongs
- Leave `ResumeEditor` export controls untouched — that is the right place for paper size and margins.

## Out of scope

- No new routes or backend tables.
- No changes to the PDF generator itself (we already generate a nice layout).
- No payment wiring; pricing page remains mock/coming-soon.

## Files to modify
- `src/pages/Landing.tsx` — hero copy/CTAs, How it works, pricing copy.
- `src/components/sections/TemplatesSection.tsx` — add a `minimal?: boolean` prop to hide export controls; update landing usage.
- `src/pages/Example.tsx` — remove `TemplatesSection`.
- `src/components/SiteHeader.tsx` — rename "Example" nav item to "Sample resume".
- `src/lib/plans.ts` — update feature list copy.
