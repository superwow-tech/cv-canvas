# Applyo — turn the CV tool into a SaaS product

Applyo: build a portfolio-quality resume in minutes, export print-ready PDFs.

## What exists today
A single-resume demo: hardcoded resume data, three PDF templates (Timeline, Classic, Minimal), a templates gallery with preview modal, and export options (A4/Letter, margins). No routes beyond `/`, no accounts, no payments.

## What we build

### 1. Marketing landing page (`/`)
- Hero: product name, tagline, primary CTA "Build my resume free", secondary "See templates".
- Live proof: the existing template thumbnails + PDF preview modal, using your CV as the sample.
- Feature blocks: multi-step wizard, three designs, print-ready A4/Letter export, save & re-edit.
- How it works (3 steps), FAQ, pricing section, footer with legal links.
- Keeps the current mint/off-white, bold editorial style. SEO: title, meta description, JSON-LD SoftwareApplication.
- The existing portfolio page moves to `/example` as a live sample resume.

### 2. Accounts (Lovable Cloud)
- Email/password signup + login, session persistence, password reset.
- `/app` protected area; unauthenticated visitors are redirected to `/auth`.
- Profile record created on signup.

### 3. Resume builder (editable data)
- Multi-step wizard: Personal info → Profile → Experience → Education → Skills → Languages → Template & export.
- Add/remove/reorder entries, autosave to the user's account, live preview pane next to the form.
- Dashboard at `/app`: list of saved resumes, create / rename / duplicate / delete.
- The PDF generator is refactored to take a resume object instead of importing hardcoded data.

### 4. Plans and payments (Stripe)
- Free: 1 resume, Timeline template, watermark-free but limited to A4 default.
- Pro (monthly): unlimited resumes, all templates, all export options.
- Stripe Checkout + billing portal, subscription state stored per user and enforced on both UI and export.

### 5. SaaS essentials
- Pricing page, account/billing page, Terms and Privacy pages.
- Empty states, loading states, mobile-first layouts, error toasts.

## Technical notes
- New routes: `/`, `/example`, `/pricing`, `/auth`, `/app`, `/app/resume/:id`, `/account`, `/terms`, `/privacy`.
- Lovable Cloud tables: `profiles`, `resumes` (JSONB document + template + export settings), `subscribers`; RLS scoped to `auth.uid()` with explicit grants.
- Stripe via Lovable's payments integration: edge functions for checkout session, subscription check, and billing portal.
- `src/lib/generate-cv.ts` signature changes to `generateCVBlob(resume, templateId, options)`; template definitions in `cv-templates.ts` stay as-is.
- Existing types in `src/types/portfolio.ts` become the shared resume schema.

## Suggested order
1. Landing page + `/example` + routing (visible immediately, no backend).
2. Cloud + auth + resumes table + dashboard.
3. Wizard with live preview and generator refactor.
4. Stripe plans + gating + billing/legal pages.

Step 1 can ship on its own; tell me if you want to stop after it and review before we wire up the backend.
