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

Copy `.env.example` to `.env.local` and optionally add a GitHub token for higher API rate limits:

```bash
cp .env.example .env.local
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add `GITHUB_TOKEN` in project settings (optional)
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
