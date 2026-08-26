# Yashwanth Portfolio

A dark, cinematic portfolio inspired by [Ricardo Chance](https://ricardochance.com), built with **Next.js**, **Tailwind CSS**, and **React Three Fiber**.

## Features

- Full-screen hero with interactive 3D particle star (mouse-responsive)
- Minimal navigation with corner frame accents
- About, GitHub Projects, Blog, and Contact sections
- Featured GitHub projects with live 3D React Three Fiber visuals
- GitHub repos fetched from the API (revalidated hourly)
- Fully responsive layout
- Vercel-ready deployment

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customize

Edit `src/lib/site-config.ts` for your name, copy, email, social links, and featured project list.

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Optionally add `GITHUB_TOKEN` for higher GitHub API rate limits when fetching repos.

The contact form opens the visitor’s email app with a prefilled message. No FormSubmit or Vercel inbox env var is required.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Optionally add `GITHUB_TOKEN` in project settings
4. Deploy

Or use the Vercel CLI:

```bash
npx vercel
```

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS 4
- React Three Fiber + Three.js
- TypeScript
