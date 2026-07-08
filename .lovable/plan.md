Implement a real PDF download for the existing "Download CV" button in the hero section.

## What will be built

1. **PDF generation utility** (`src/lib/generate-cv.ts`)
   - Uses `jspdf` + `jspdf-autotable` to build a clean, ATS-friendly CV from the existing portfolio data.
   - Includes: name/title/contact, professional summary, skills grouped by category, work experience with bullets, education, and languages.
   - Default filename: `Sarunas-Jaraminas-CV.pdf`.

2. **Updated HeroSection** (`src/components/sections/HeroSection.tsx`)
   - Replaces the mocked `alert("CV download coming soon.")` with an async handler that calls the generator.
   - Uses the Sonner toast stack (already in the app) to show "Generating CV…" and "CV downloaded" feedback.
   - Keeps the existing button styling and icon.

3. **PDF visual direction**
   - Clean, single-column A4 layout.
   - Dark slate text (`#1f2937`), gray secondary text (`#6b7280`), mint accent (`#6BCABA`) for section underlines.
   - Standard Helvetica/Helvetica-Bold fonts for reliability across PDF readers.

## Technical details

- Add dependencies: `jspdf`, `jspdf-autotable`.
- No backend required; generation runs entirely in the browser.
- Build will be verified with `bun run build`.
- Download flow will be verified in the preview with a Playwright script that clicks the button and checks the generated PDF renders without errors.