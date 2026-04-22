# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working Rules

1. **Communicate in Chinese.** All user-facing messages, explanations, progress updates, and end-of-turn summaries must be written in Simplified Chinese, regardless of the language the user writes in. Code, identifiers, file paths, commit messages, and inline code comments stay in their original language.
2. **Never commit code changes.** Do not run `git commit`, `git push`, `git tag`, or any other command that writes to git history, even if a task feels "done". Leave changes staged/unstaged in the working tree and let the user review and commit manually. This applies even if the user's instruction sounds like it implies committing ("save this", "ship it", "finish the task") — confirm explicitly before any git write operation.

## Commands

Package manager is `pnpm` (see `packageManager: pnpm@7.14.0` in `package.json`; `pnpm-lock.yaml` is the source of truth — `package-lock.json` is a stale leftover).

```bash
pnpm install          # install dependencies (Node 20.x required, see .nvmrc)
pnpm dev              # start dev server on :3000
pnpm build            # production build (Next.js)
pnpm start            # serve production build
pnpm lint             # next lint (cached)
pnpm lint:fix         # eslint --fix across the repo
pnpm prettier         # prettier --write .
```

No test runner is configured despite what `README.md` claims — `pnpm test` will fail.

`next.config.mjs` has `eslint.ignoreDuringBuilds: true`, so lint errors will **not** fail `pnpm build`. Run `pnpm lint` manually before shipping.

## Architecture

### Routing & i18n (the most important thing to internalize)

This is a Next.js 14 App Router site localized into 7 languages via `next-intl`. The locale list lives in `i18n.ts` (`en, bg, mx, fr, br, es, tw`) along with labels and the `getRequestConfig` that loads `messages/{locale}.json`.

`middleware.ts` runs `createMiddleware` with `localePrefix: 'as-needed'`. Consequences:

- English lives at `/`, `/letreiroonlineled`, `/getstarted` — **no `/en` prefix**.
- Other locales are prefixed: `/br/letreiroonlineled`, `/tw`, etc.
- Any canonical URL or sitemap entry must respect this asymmetry (see `app/sitemap.ts`, and the `canonicalUrl` constants inside `letreiroonlineled/page.tsx` and `getstarted/page.tsx`).

**Always use the wrappers in `app/navigation.ts`** (`Link`, `useRouter`, `usePathname`, `redirect`) instead of the raw ones from `next/navigation` / `next/link`. The raw ones strip the locale. `components/home/QuickMenu.tsx` currently violates this — don't copy that pattern.

### Route group layout

Inside `app/[locale]/` route groups control which chrome wraps a page:

```
[locale]/
  (with-header)/
    layout.tsx            ← Navigation
    (with-footer)/
      layout.tsx          ← Footer
      (home)/page.tsx     ← "/"
      (footer)/
        privacy-policy/page.tsx
        terms-of-service/page.tsx
      letreiroonlineled/page.tsx
      getstarted/page.tsx
  (without-header)/
    generator/page.tsx    ← "/generator" (embed target, no chrome)
  [...rest]/page.tsx      ← catch-all → notFound()
```

When adding a page, pick the right group so you inherit (or skip) header/footer instead of re-implementing layout.

### Metadata convention

Each locale-sensitive page has its own `generateMetadata`:

- The home page uses a dedicated `app/[locale]/(with-header)/(with-footer)/(home)/metadata.ts` re-exported through the adjacent `layout.tsx`.
- Subpages (`letreiroonlineled`, `getstarted`) define `generateMetadata` inline and delegate rendering to a separate `*Content.tsx` client component.

All titles/descriptions live in `messages/{locale}.json` under `Metadata.{page}`. Keep that contract when adding pages — don't hardcode strings in `metadata.ts`.

### i18n file loading

`i18n.ts` eagerly `import()`s the whole locale JSON. When editing translation keys, update every file in `messages/` in sync — there is no fallback mechanism and a missing key will render the raw key string.

### The LED display stack

Three layered components, all client-only:

- `components/LEDDisplay.tsx` — pure CSS marquee (transforms + `@keyframes marquee` in `globals.css`). Cheap. Used for `default` and `blur` modes.
- `components/TrueLEDDisplay.tsx` — `<canvas>` driven dot-matrix renderer. Uses the 16×16 glyph table in `lib/dotMatrixFont.ts` (~23 KB, bundled into any route that imports it). Used for `led` mode.
- `components/MarqueeLED.tsx` — interactive wrapper (controls, fullscreen, mode switch, "Generator" deep-link). Reused in `/letreiroonlineled`.

The home page **duplicates `MarqueeLED` inline** inside `(home)/page.tsx` instead of reusing it. If you touch either, mirror the change in both files — otherwise home and LED-mode drift apart. Long-term: consolidate.

`/generator` is a deliberately chrome-less route that reads display config from URL query params (`text`, `textColor`, `bgColor`, `speed`, `displayMode`) and is intended to be embedded via `<iframe>` (see the embed snippet in `GetStarted` translations).

### Shared infrastructure

- `lib/env.ts` exports `BASE_URL` (from `NEXT_PUBLIC_SITE_URL` or `VERCEL_URL`) plus Google Ads/Analytics IDs. Everything that builds an absolute URL should go through it.
- `lib/utils.ts` exports `cn(...)` (clsx + tailwind-merge). Use it for conditional class strings.
- `components/seo/SeoScript.tsx` injects both Google Analytics (`gtag`) and a second pageview tracker (`pageview.app`) — they duplicate coverage; keep that in mind if touching analytics.
- `components/ad/GoogleAdScript.tsx` pulls AdSense in the root layout.

### Styling

Tailwind with `@tailwindcss/typography` + `tailwindcss-animate`. `globals.css` holds custom keyframes (`marquee`, `flicker`), LED visual effects (`.led-text`, `.led-effect`), and a set of CLS-prevention helpers (`.animate-hardware`, `.content-placeholder`, `min-h-component`). Past CLS work is why many containers carry explicit `minHeight` / `contain: layout paint size` inline styles — preserve those when refactoring.

Prettier uses `@ianvs/prettier-plugin-sort-imports` with an opinionated import order defined in `.prettierrc.json`; `prettier-plugin-tailwindcss` also sorts class names. Let the formatter win — don't hand-reorder.

Path alias: `@/*` → repo root (see `tsconfig.json`).

## Gotchas

- `middleware.ts` declares `runtime: 'experimental-edge'`. The supported value in Next 14 is `'edge'`; `experimental-edge` is deprecated but still resolves, so builds pass. Change cautiously — this file is touched on every request.
- `package.json` lists `"letreiro-digital": "file:"` as a dependency (self-reference). It's harmless on Vercel but can break fresh local installs on some npm versions. If you touch deps, leave it alone unless you're prepared to test `pnpm install` from a clean cache.
- Root-level `index.html` is a pre-Next.js legacy artifact. It is **not** served by the current app. Don't edit it expecting changes to appear.
- `app/sitemap.ts` enumerates only `/`, `/letreiroonlineled`, `/getstarted` — privacy/terms pages exist but are absent. Add new routes there when publishing them.
- Hreflang alternates are **not** set in `generateMetadata`. If you add SEO metadata, populate `alternates.languages` using the `locales` list from `i18n.ts`.
- `tsconfig.json` targets `es5`. Avoid assuming modern output; if you change it, verify bundle diff.
