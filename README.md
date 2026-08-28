# Applyo — Resume & CV Builder

Build a portfolio-quality resume in minutes. Guided wizard, live preview, three designs, and print-ready A4 or Letter PDF export. Built with **Vite**, **React**, **TypeScript**, and **Tailwind CSS**.

## Tech stack

- **Vite** — fast dev server and production builds
- **React 18** — UI library
- **TypeScript** — type-safe code
- **Tailwind CSS v4** — utility-first styling
- **shadcn/ui** — accessible UI components
- **Framer Motion + GSAP** — animations
- **jspdf + jspdf-autotable** — client-side PDF resume generation
- **Lovable Cloud (Supabase)** — auth, database, and subscriptions

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)
- A package manager such as **npm**, **yarn**, **pnpm**, or **bun** (the lockfile is `bun.lock`)

## Setup

1. Clone the repository:

   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd <YOUR_REPOSITORY_NAME>
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

## Development

Start the local development server:

```bash
npm run dev
```

The Vite dev server will start and print a local URL (usually `http://localhost:5173`). Open it in your browser. The page reloads automatically when you edit files.

## Build for production

```bash
npm run build
```

This creates an optimized production bundle in the `dist/` folder.

## Preview the production build

```bash
npm run preview
```

Serves the contents of `dist/` locally so you can verify the production build before deploying.

## Linting

```bash
npm run lint
```

Runs ESLint across the project.

## Project structure

```
.
├── public/               # Static assets (favicon, 404 fallback, etc.)
├── src/
│   ├── components/       # Reusable UI components and section components
│   ├── data/             # Sample resume and template content
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities, resume schema, and PDF generation
│   ├── pages/            # Top-level page components (landing, auth, dashboard, editor)
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main app component with routing
│   ├── index.css         # Global styles and Tailwind imports
│   └── main.tsx          # App entry point
├── supabase/             # Database migrations
├── index.html            # HTML template
├── package.json          # Scripts and dependencies
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## Deploying

Build the project for production and deploy the contents of the `dist/` folder on any static hosting platform (Vercel, Netlify, GitHub Pages, AWS S3, etc.).

## Deploying to GitHub Pages

This repository includes a GitHub Actions workflow that builds and deploys the site to GitHub Pages automatically.

1. Create a GitHub repository named `applyo` and push this code to the `main` branch.
2. In the repository settings, go to **Pages → Build and deployment** and set **Source** to **GitHub Actions**.
3. Push any commit to `main`. The workflow in `.github/workflows/deploy.yml` will build the site and deploy it.
4. Once the deployment finishes, the site will be live at:

   ```
   https://<your-github-username>.github.io/applyo/
   ```

> **Note:** GitHub Pages is free for public repositories. Private repositories require a GitHub Pro plan to use Pages.
> If you use a different repository name, update the `build:gh-pages` script in `package.json` and the redirect path in `public/404.html` to match.

## Notes

- The resume PDF is generated entirely in the browser using `jspdf` and `jspdf-autotable`.
- All sample resume and portfolio content is fictional placeholder data and lives in `src/data/`.
