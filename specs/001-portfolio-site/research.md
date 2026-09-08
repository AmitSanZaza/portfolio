# Phase 0 Research: Portfolio Site

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

All Technical Context items were resolved through a direct conversation with the user (stack, hosting, experience level) before this document was written; no items required independent research to unblock planning. This document records the resulting decisions and the alternatives considered, so later phases don't need to re-derive them.

## Decision: Framework — Next.js (App Router) + TypeScript

- **Rationale**: A single framework that serves both the public pages (project list, about, skills, contact) and the protected admin CRUD interface, without standing up a separate backend service. Huge ecosystem and documentation, which matters for a beginner/student maintaining the site solo. Server Actions let the admin forms call server-side logic (create/edit/delete project) directly, without hand-building a REST API.
- **Alternatives considered**:
  - Plain HTML/CSS/JS + a small custom backend (e.g., Express) — rejected: more moving parts to wire together by hand (routing, auth, API, deployment) for a beginner, with no meaningful benefit for a site this size.
  - Static site generator (e.g., Astro/Eleventy) editing Markdown files directly — rejected: doesn't satisfy the explicit requirement for a form-based admin interface (the user chose "interface d'administration" over "fichier de données simple" during specification).

## Decision: Data & Auth & Image Storage — Supabase (Postgres + Auth + Storage)

- **Rationale**: Bundles the three things the feature needs (persistent `projects` data, owner authentication, and image hosting) behind one well-documented, beginner-friendly SDK (`@supabase/supabase-js`, `@supabase/ssr`), instead of stitching together separate services. Free tier is sufficient for a personal portfolio's scale. Row Level Security (RLS) policies give a straightforward way to enforce FR-011 (only the authenticated owner can write) directly at the data layer, which is more robust than relying on UI checks alone.
- **Alternatives considered**:
  - SQLite file on the server — rejected: Vercel's serverless functions have an ephemeral, non-shared filesystem, so writes wouldn't reliably persist or be visible across requests/deployments.
  - Hand-rolled auth (custom password hashing + session cookies) — rejected: more security-sensitive code for a beginner to get right (FR-011, SC-005 depend on this working correctly); Supabase Auth is a maintained, audited implementation of the same need.
  - Separate services for DB (e.g., Neon) + auth (e.g., NextAuth) + image hosting (e.g., Cloudinary) — rejected: more accounts, more configuration, more integration surface than a single Supabase project for no added capability at this scale.

## Decision: Hosting — Vercel

- **Rationale**: User's explicit choice. Zero-config deployment for Next.js, free tier fits a personal portfolio, automatic deploys from Git.
- **Alternatives considered**: Self-hosting/other host — deferred; not needed given the user's preference and Vercel's fit with the chosen framework.

## Decision: Styling — Tailwind CSS

- **Rationale**: Utility classes avoid hand-managing a separate CSS architecture (naming conventions, cascade issues) while still being plain, readable code a beginner can trace directly in the markup — no CSS-in-JS runtime or design-token system to learn first.
- **Alternatives considered**: Plain CSS modules — viable but slower to produce a polished, responsive (FR-012) layout without prior CSS layout experience; component library (e.g., MUI) — rejected as heavier and more opinionated than needed for a small portfolio.

## Decision: Testing — Vitest + React Testing Library, manual quickstart for end-to-end validation

- **Rationale**: Lightweight unit/component testing for the validation logic (FR-006) and rendering of project cards/empty state, matching Next.js + TypeScript out of the box. Full end-to-end coverage (e.g., Playwright) is left out of initial scope to keep the beginner's maintenance burden low; `quickstart.md` instead documents manual validation steps that exercise the same acceptance scenarios end-to-end.
- **Alternatives considered**: Playwright/Cypress e2e suite — deferred as a possible future addition once the owner is comfortable with the codebase; not required to meet the spec's success criteria.

## Decision: Project structure — single Next.js application (no separate frontend/backend)

- **Rationale**: Next.js's App Router serves public routes, the `/admin` routes, and server-side data logic (Server Actions / route handlers) from one project. A separate backend would duplicate routing/deployment concerns the framework already solves.
- **Alternatives considered**: `frontend/` + `backend/` split (Option 2 in the plan template) — rejected as unnecessary complexity; Next.js's Server Actions remove the need for a hand-built API layer between UI and data.

## Outstanding NEEDS CLARIFICATION

None. All Technical Context fields are resolved.
