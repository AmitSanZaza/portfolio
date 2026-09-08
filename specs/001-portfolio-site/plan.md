# Implementation Plan: Portfolio Site

**Branch**: `001-portfolio-site` | **Date**: 2026-09-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-portfolio-site/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

A personal portfolio site with a public side (project showcase, About, Skills, Contact) and a password-protected admin area where the owner creates, edits, and deletes project entries through a form — no code changes needed to update content. Built as a single Next.js (App Router, TypeScript) application, using Supabase for the projects database, owner authentication, and project image storage, deployed on Vercel.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20 LTS, Next.js 15 (App Router)

**Primary Dependencies**: Next.js, React, `@supabase/supabase-js` + `@supabase/ssr` (data, auth, image storage client), Tailwind CSS (styling), Zod (server-side form/input validation for FR-006)

**Storage**: Supabase Postgres (`projects` table) + Supabase Storage (project images); Supabase Auth for the single owner account

**Testing**: Vitest + React Testing Library for unit/component tests (validation logic, project card rendering, empty state); manual scenario walkthrough in `quickstart.md` for end-to-end acceptance validation

**Target Platform**: Web — responsive, modern desktop and mobile browsers; deployed as a serverless Next.js app on Vercel

**Project Type**: Web application (single full-stack Next.js project; no separate frontend/backend needed — Server Actions handle admin read/write logic)

**Performance Goals**: Public project list visible within 3s of load (SC-001), consistent with standard server-rendered Next.js page performance

**Constraints**: Fully usable on desktop and mobile widths (FR-012/SC-004); admin write access blocked for unauthenticated users 100% of the time (FR-011/SC-005); must run within Supabase's and Vercel's free tiers (personal-project budget)

**Scale/Scope**: Single owner/admin; a personal-scale project catalog (tens of projects, not hundreds); low traffic (personal portfolio visit volumes)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` is still the unfilled placeholder template — no project principles have been ratified for this repository yet. There are no gates to evaluate against, so this check is **not applicable** and is not blocking. If a constitution is ratified later, this feature should be re-checked against it.

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-site/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
app/
├── (public)/
│   ├── page.tsx               # Home: project list (US1)
│   ├── projects/[slug]/       # Optional project detail view (US1)
│   ├── about/page.tsx         # About section (US3)
│   ├── skills/page.tsx        # Skills section (US3) — may be merged into about/home
│   └── contact/page.tsx       # Contact section (US3)
├── admin/
│   ├── login/page.tsx         # Owner authentication (US2)
│   ├── projects/page.tsx      # List + manage own projects (US2)
│   ├── projects/new/page.tsx  # Create project form (US2)
│   └── projects/[id]/edit/    # Edit project form (US2)
├── actions/
│   ├── projects.ts            # Server Actions: createProject, updateProject, deleteProject
│   └── auth.ts                # Server Actions: login, logout
├── layout.tsx
└── globals.css

components/
├── project-card.tsx
├── project-form.tsx
├── empty-state.tsx
└── nav.tsx

lib/
├── supabase/
│   ├── client.ts               # Browser Supabase client
│   └── server.ts                # Server Supabase client (SSR/Server Actions)
├── validation/
│   └── project.ts               # Zod schema for project fields (FR-006)
└── auth/
    └── session.ts                # Helpers to require an authenticated owner (FR-004, FR-011)

tests/
├── unit/
│   ├── validation.test.ts       # Zod schema: required fields, invalid URL (FR-006)
│   └── project-card.test.tsx    # Renders title/image/description/tags/links (FR-001, FR-002)
└── integration/
    └── empty-state.test.tsx     # No projects → empty-state message (FR-003)
```

**Structure Decision**: Single Next.js application at the repository root (Option 1-style single project, adapted for a web app). Public routes live under `app/(public)/`, the protected admin CRUD UI under `app/admin/`, and all data/auth mutations go through Server Actions in `app/actions/` so there's no separate REST API layer to design or maintain. This matches the "no separate frontend/backend" decision in [research.md](./research.md).

## Complexity Tracking

*No constitution is ratified for this repository, and no gates were violated — this section is not applicable.*
