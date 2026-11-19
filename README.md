# Live Cricket Scores (Public Web)

Read-only public live-score web app built with Next.js App Router, TypeScript, and Tailwind CSS.

## Stack

- Next.js 16.1.6
- TypeScript
- Tailwind CSS
- App Router

## Run

```bash
npm install
npm run dev
```

## Test

```bash
npm test
```

## Cloudflare Workers Deployment (2026)

This repo is configured for Cloudflare Workers using OpenNext.

### One-time setup

```bash
npm install
```

Then copy `.dev.vars.example` to `.dev.vars`.

### Local Cloudflare preview

```bash
npm run cf:preview
```

### Deploy

```bash
npm run cf:deploy
```

### Runtime env vars and secrets

Set production secrets/variables in Cloudflare:

```bash
wrangler secret put INTERNAL_READ_API_URL
wrangler secret put REDIS_URL
wrangler secret put NEXT_PUBLIC_SITE_URL
wrangler secret put PUBLIC_API_BASE_URL
```

Optional type generation for Worker bindings:

```bash
npm run cf:typegen
```

## Scope

- Public read-only pages for live scores, matches, series, teams, players, rankings, and search
- Read-only route handlers under `app/api/*`
- No scorer/admin write features

# sportsera
