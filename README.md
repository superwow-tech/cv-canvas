# Šarūnas Jaraminas — Portfolio

A personal portfolio and downloadable CV built with **Vite**, **React**, **TypeScript**, and **Tailwind CSS**.

## Tech stack

- **Vite** — fast dev server and production builds
- **React 18** — UI library
- **TypeScript** — type-safe code
- **Tailwind CSS v4** — utility-first styling
- **shadcn/ui** — accessible UI components
- **Framer Motion + GSAP** — animations
- **jspdf + jspdf-autotable** — client-side PDF CV generation

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

The Vite dev server will start and print a local URL (usually `http://localhost:5173`). Open it in your browser to view the portfolio. The page reloads automatically when you edit files.

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
├── public/               # Static assets (favicon, images, etc.)
├── src/
│   ├── components/       # Reusable UI components and section components
│   ├── data/             # Portfolio content and CV data
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities, helpers, and PDF generation
│   ├── pages/            # Top-level page components
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main app component with routing
│   ├── index.css         # Global styles and Tailwind imports
│   └── main.tsx          # App entry point
├── index.html            # HTML template
├── package.json          # Scripts and dependencies
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## Deploying

This project is developed in [Lovable](https://lovable.dev). You can publish it directly from the Lovable editor, or connect the project to GitHub and deploy the built `dist/` folder on any static hosting platform (Vercel, Netlify, GitHub Pages, etc.).

## Notes

- The CV PDF is generated entirely in the browser using `jspdf` and `jspdf-autotable` — no backend is required.
- Source data for the portfolio and CV lives in `src/data/portfolio-data.ts`.
