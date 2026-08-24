# Plan: Portfolio Snapshot + Resume Builder Project

## Goal
Preserve the current Šarūnas Jaraminas portfolio as a standalone example, then start a fresh Lovable project to build a multi-step resume/CV builder that can produce portfolio-quality PDFs like this one.

## Phase 1 — Snapshot the current portfolio
1. Confirm the current build, metadata, and GitHub Pages config are clean.
2. Guide you to create a new GitHub repository (e.g. `sarunas-portfolio-example`) and push the current code, or use Lovable's Remix feature to make an independent copy.
3. Tag the final state in the new repo so it remains a reference.

## Phase 2 — Start the resume builder project
1. Create a new Lovable project from the editor (you will do this step; I cannot create projects from chat).
2. Port over reusable assets from the portfolio snapshot: color tokens, typography, timeline layout, and PDF generation patterns.
3. Set up the same tech stack: Vite + React + TypeScript + Tailwind + shadcn/ui + Framer Motion + jspdf.

## Phase 3 — Core multi-step wizard
1. **Stepper navigation** — Personal Info → Experience → Education → Skills → Languages → Review.
2. **Live preview pane** — Show the rendered resume updating as the user types.
3. **Form state management** — Centralized resume data model with add/remove/reorder for entries.
4. **PDF export** — Reuse and extend the `jspdf` generator so it supports multiple templates.

## Phase 4 — Multiple templates
1. **Template 1: Timeline** — The same full-width, timeline-dot layout we polished for your portfolio.
2. **Template 2: Classic** — A traditional two-column or compact single-column CV.
3. **Template 3: Minimal** — A clean, spaced-out design for creatives/consultants.
4. Each template shares the same data model but renders its own PDF layout.

## Phase 5 — Polish & deploy
1. Responsive wizard UI, mobile-friendly preview, and accessible form controls.
2. Add a "Download PDF" and "Start over" flow.
3. Configure GitHub Pages (or your preferred host) for the new project.

## Notes
- I cannot create a new Lovable project from this chat. The plan assumes you create it, then I do the build inside the new project.
- If you prefer, we can first finalize/publish the current portfolio before moving on.
