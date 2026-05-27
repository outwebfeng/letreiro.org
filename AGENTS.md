# Repository Guidelines

## Project Structure & Module Organization

This is a Next.js 14 App Router project written in TypeScript. Route files live in `app/`, with localized routes under `app/[locale]` and route groups such as `(with-header)`, `(with-footer)`, and `(without-header)`. Shared React components are in `components/`; reusable UI primitives are in `components/ui`, page-level blocks in `components/home`, and feature components such as sharing, ads, cookies, and templates in their own subfolders. Shared logic belongs in `lib/`, including utilities, templates, canvas export, and LED font data. Translation files are in `messages/*.json`. Static files and public assets are in `public/`, and custom type declarations are in `types/`.

## Build, Test, and Development Commands

Use Node 22.x and pnpm 7.14.0, as declared in `package.json`.

- `pnpm install` installs dependencies.
- `pnpm dev` starts the local Next.js development server.
- `pnpm build` creates the production build and validates routes.
- `pnpm start` serves the production build after `pnpm build`.
- `pnpm lint` runs Next.js ESLint with cache enabled.
- `pnpm lint:fix` applies ESLint fixes across the repository.
- `pnpm prettier` formats files with Prettier and Tailwind class sorting.

## Coding Style & Naming Conventions

Use TypeScript, React function components, and 2-space indentation. Prettier enforces semicolons, single quotes, trailing commas, and a 120-character print width. Imports are sorted by `@ianvs/prettier-plugin-sort-imports`; Tailwind classes are sorted by `prettier-plugin-tailwindcss`. Name React components in PascalCase, utility functions in camelCase, and keep locale keys consistent across `messages/en.json`, `messages/es.json`, and `messages/pt.json`.

## Testing Guidelines

No test runner or `test` script is currently configured. For now, run `pnpm lint` and `pnpm build` before submitting changes. When adding tests, colocate them near the code they cover using `*.test.ts` or `*.test.tsx`, and add the matching package script in the same change.

## Commit & Pull Request Guidelines

Recent commits use concise Chinese summaries that describe the user-visible change, for example `添加 GIF 导出功能...` or `修复 plausible 无法获取到数据问题。`. Keep commits focused and imperative. Pull requests should include a short description, validation steps such as `pnpm lint` and `pnpm build`, linked issues when applicable, and screenshots or recordings for UI changes.

## Security & Configuration Tips

Copy required local environment values from `.env.example`; do not commit secrets. Keep analytics, ads, and consent-related changes isolated and verify localized copy in every supported message file.

## Agent-Specific Instructions

Communicate with users and return final responses in Chinese. Do not create git commits after modifying code unless the user explicitly requests a commit.
