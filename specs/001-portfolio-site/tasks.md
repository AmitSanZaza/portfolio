---

description: "Task list for Portfolio Site feature implementation"
---

# Tasks: Portfolio Site

**Input**: Design documents from `/specs/001-portfolio-site/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/admin-actions.md](./contracts/admin-actions.md), [quickstart.md](./quickstart.md)

**Tests**: Unit/integration test tasks are included because `plan.md` already commits to a specific testing approach (Vitest + React Testing Library) and specific test files as part of the chosen architecture — they are not exhaustive TDD gating, just the tests the plan calls for.

**Organization**: Tasks are grouped by user story (from spec.md) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- File paths follow the structure in [plan.md](./plan.md)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize the Next.js (App Router, TypeScript) project at the repository root, with Tailwind CSS configured, per the structure in [plan.md](./plan.md)
- [X] T002 [P] Install and pin dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `vitest`, `@testing-library/react`, `jsdom` (or equivalent test environment), per [research.md](./research.md)
- [X] T003 [P] Configure ESLint + Prettier for the TypeScript/Next.js project
- [ ] T004 Create the Supabase project resources: a `projects` table matching the schema in [data-model.md](./data-model.md) (`id`, `title`, `description`, `image_url`, `technologies`, `demo_url`, `source_url`, `display_order`, `created_at`, `updated_at`), a public-read Storage bucket for project images, and one Auth user for the owner; record the required env vars (Supabase URL, anon key) in `.env.example`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create the Supabase browser client in `lib/supabase/client.ts` (`@supabase/supabase-js`), reading the URL/anon key from environment variables
- [X] T006 [P] Create the Supabase server client for SSR/Server Actions in `lib/supabase/server.ts` (`@supabase/ssr`)
- [X] T007 [P] Create the root layout and global styles in `app/layout.tsx` and `app/globals.css` (Tailwind base)
- [X] T008 [P] Create the site `Nav` component in `components/nav.tsx` with links to Home, About, Skills, Contact (admin login/logout state added in US2)
- [X] T009 [P] Add environment variable loading with a clear error if Supabase config is missing (e.g., `lib/env.ts`), and document them in `.env.example` (builds on T004)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Visitor browses the project showcase (Priority: P1) 🎯 MVP

**Goal**: A visitor can load the site and see every showcased project with its title, image, description, technologies, and working demo/source links; an empty state is shown when there are no projects yet.

**Independent Test**: Load the site with a set of sample projects already in the `projects` table; confirm each project card shows its title, image, description, technology tags, and working links (per [quickstart.md](./quickstart.md) Scenario 1).

### Tests for User Story 1

- [X] T010 [P] [US1] Unit test in `tests/unit/project-card.test.tsx`: `ProjectCard` renders title, image, description, technology tags, and demo/source links (FR-001, FR-002); renders a placeholder when `image_url` is missing or fails to load (Edge Case)
- [X] T011 [P] [US1] Integration test in `tests/integration/empty-state.test.tsx`: home page renders the empty-state message when `getProjects()` returns an empty list (FR-003)

### Implementation for User Story 1

- [X] T012 [P] [US1] Implement `getProjects()` in `app/actions/projects.ts` per [contracts/admin-actions.md](./contracts/admin-actions.md): reads all rows from the `projects` table ordered by `display_order`, no auth required (FR-001, FR-003)
- [X] T013 [P] [US1] Implement the `EmptyState` component in `components/empty-state.tsx` (FR-003)
- [X] T014 [P] [US1] Implement the `ProjectCard` component in `components/project-card.tsx`: title, description, technology tags, demo/source links opening the correct destinations (FR-001, FR-002); if `image_url` is absent or the image fails to load, render a fallback placeholder instead of a broken image icon (Edge Case)
- [X] T015 [US1] Implement the home page in `app/(public)/page.tsx`: calls `getProjects()` and renders a `ProjectCard` per project, or `EmptyState` when the list is empty (FR-001, FR-003) (depends on T012, T013, T014)
- [X] T016 [US1] Apply responsive Tailwind styling to the project list/cards so they remain readable and usable at mobile widths, with no horizontal scrolling (FR-012, SC-004) (depends on T015)
- [ ] T017 [US1] Run [quickstart.md](./quickstart.md) Scenario 1 manually (empty state, project card fields, working links, broken-image fallback) and fix any issues found

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently — the public showcase works even before the admin interface exists.

---

## Phase 4: User Story 2 - Owner manages projects without touching code (Priority: P2)

**Goal**: The owner can log into a protected admin area and create, edit, and delete project entries through a form, with changes reflected immediately on the public site.

**Independent Test**: Log into the admin area, create a new project through the form, verify it appears on the public project list; then edit and delete it, verifying the public list updates accordingly (per [quickstart.md](./quickstart.md) Scenario 2).

### Tests for User Story 2

- [X] T018 [P] [US2] Unit test in `tests/unit/validation.test.ts`: the project Zod schema rejects an empty `title`, an empty `description`, and a malformed `demo_url`/`source_url`, and accepts valid input (FR-006)

### Implementation for User Story 2

- [X] T019 [P] [US2] Create the Zod validation schema for `Project` in `lib/validation/project.ts` implementing the constraints from [data-model.md](./data-model.md): `title` required, non-empty, max 120 chars; `description` required, non-empty, max 2000 chars; `demo_url` and `source_url` must parse as a valid absolute URL when provided; each `technologies` tag non-empty with a reasonable max length/count (FR-006)
- [X] T020 [US2] Create the `requireOwnerSession()` auth guard in `lib/auth/session.ts`: checks for a valid Supabase Auth session and redirects to `/admin/login` if absent (FR-004, FR-011)
- [X] T021 [P] [US2] Implement `login()` and `logout()` Server Actions in `app/actions/auth.ts` per [contracts/admin-actions.md](./contracts/admin-actions.md): `login` delegates credential checking to Supabase Auth and returns a generic `"Invalid email or password"` error on failure without revealing whether the email exists (Edge Case); `logout` clears the session (FR-004)
- [X] T022 [US2] Implement the admin login page in `app/admin/login/page.tsx`: email/password form calling `login()`, redirecting to `/admin/projects` on success and showing the generic error on failure (depends on T021)
- [X] T023 [US2] Implement `createProject`, `updateProject`, `deleteProject` Server Actions in `app/actions/projects.ts` per [contracts/admin-actions.md](./contracts/admin-actions.md): each calls `requireOwnerSession()` first (FR-011); `createProject`/`updateProject` validate input with the schema from T019 and return `fieldErrors` on failure (FR-006), upload `imageFile` to Supabase Storage when provided and store the resulting URL as `image_url`, then insert/update the row; `deleteProject` removes the row (FR-005, FR-007) (depends on T019, T020)
- [X] T024 [P] [US2] Implement the reusable `ProjectForm` component in `components/project-form.tsx`: fields for title, description, image upload, technologies tags, demo URL, source URL, with inline display of `fieldErrors` returned by the Server Actions (FR-006)
- [X] T025 [US2] Implement the admin projects list page in `app/admin/projects/page.tsx`: guarded by `requireOwnerSession()`, lists existing projects with edit and delete controls (depends on T020, T023)
- [X] T026 [P] [US2] Implement the "new project" page in `app/admin/projects/new/page.tsx` using `ProjectForm` and `createProject` (depends on T023, T024)
- [X] T027 [P] [US2] Implement the "edit project" page in `app/admin/projects/[id]/edit/page.tsx` using `ProjectForm` pre-filled with the existing project and `updateProject` (depends on T023, T024)
- [X] T028 [US2] Wire a delete control (with a confirmation step) on the admin projects list to `deleteProject` (depends on T023, T025)
- [X] T029 [US2] Add session-aware login/logout controls to the `Nav` component in `components/nav.tsx` (depends on T021, T008)
- [ ] T030 [US2] Run [quickstart.md](./quickstart.md) Scenario 2 manually (redirect when logged out, create/edit/delete reflected on the public site, validation errors shown, wrong-credential login rejected generically) and fix any issues found

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently — the owner can maintain the showcase without editing code.

---

## Phase 5: User Story 3 - Visitor learns about the owner and can reach out (Priority: P3)

**Goal**: A visitor can read the owner's bio, see their skills, and find a working way to contact them.

**Independent Test**: Navigate to the About, Skills, and Contact sections and confirm each displays the expected content and that the contact method is usable (per [quickstart.md](./quickstart.md) Scenario 3).

### Implementation for User Story 3

- [X] T031 [US3] Define the Profile Content (bio, skills list, contact method) and a `getProfileContent()` accessor in `lib/profile-content.ts`, per the Profile Content entity in [data-model.md](./data-model.md) (FR-008, FR-009, FR-010)
- [X] T032 [P] [US3] Implement the About page in `app/(public)/about/page.tsx`, displaying the bio via `getProfileContent()` (FR-008) (depends on T031)
- [X] T033 [P] [US3] Implement the Skills page in `app/(public)/skills/page.tsx`, displaying the skills list via `getProfileContent()` (FR-009) (depends on T031)
- [X] T034 [P] [US3] Implement the Contact page in `app/(public)/contact/page.tsx`, displaying a working contact method (e.g., a `mailto:` link) via `getProfileContent()` (FR-010) (depends on T031)
- [X] T035 [US3] Add About/Skills/Contact links to the `Nav` component in `components/nav.tsx` (depends on T008, T032, T033, T034)
- [ ] T036 [US3] Run [quickstart.md](./quickstart.md) Scenario 3 manually and fix any issues found

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, and production readiness

- [X] T037 [P] Verify responsive layout (FR-012, SC-004) across all pages (home, about, skills, contact, admin) at mobile width; adjust Tailwind classes as needed
- [X] T038 Configure Supabase Row Level Security (RLS) policies on the `projects` table: public `SELECT`, `INSERT`/`UPDATE`/`DELETE` restricted to the authenticated owner, per the Access control summary in [data-model.md](./data-model.md) (FR-011, SC-005)
- [X] T039 [P] Configure the project-images Storage bucket policy for public read access (supports FR-001 image display)
- [ ] T040 Deploy the app to Vercel with the Supabase environment variables configured, then run the [quickstart.md](./quickstart.md) Deployment validation section end-to-end
- [X] T041 [P] Write a `README.md` with setup instructions (env vars, Supabase schema, running the dev server) so the owner can maintain the project independently in the future

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion; no dependency on other stories
- **User Story 2 (Phase 4)**: Depends on Foundational phase completion; independent of US1 (the public site already works without it), though it writes the data US1 reads
- **User Story 3 (Phase 5)**: Depends on Foundational phase completion; fully independent of US1 and US2 (static content, no shared data)
- **Polish (Phase 6)**: Depends on the user stories being deployed being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependency on other stories — can be demoed with projects seeded directly in Supabase.
- **User Story 2 (P2)**: No code dependency on US1, but its value (confirming an added project shows up publicly) is best demonstrated once US1 exists.
- **User Story 3 (P3)**: No dependency on US1 or US2 — entirely separate pages and data source.

### Within Each User Story

- Tests before implementation of the same behavior (T010/T011 before T012-T015; T018 before T019-T023)
- Data-read/write logic before the pages that call it
- Reusable components before the pages that assemble them
- Story complete before moving to the next priority (recommended order, not a hard blocker given the independence above)

### Parallel Opportunities

- Setup: T002, T003 in parallel after T001
- Foundational: T006, T007, T008, T009 in parallel after T005
- Once Foundational completes, all three user story phases could be staffed in parallel (they don't share files); within US1: T010/T011 in parallel, then T012/T013/T014 in parallel; within US2: T018 parallel to T019-T023 setup, then T021/T024 in parallel, then T026/T027 in parallel; within US3: T032/T033/T034 in parallel after T031
- Polish: T037, T039, T041 in parallel

---

## Parallel Example: User Story 1

```bash
# Tests together:
Task: "Unit test ProjectCard rendering in tests/unit/project-card.test.tsx"
Task: "Integration test empty state in tests/integration/empty-state.test.tsx"

# Implementation together (after tests are in place):
Task: "Implement getProjects() in app/actions/projects.ts"
Task: "Implement EmptyState component in components/empty-state.tsx"
Task: "Implement ProjectCard component in components/project-card.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run quickstart.md Scenario 1 independently — seed a couple of projects directly in Supabase to confirm the showcase works
5. Deploy/demo if ready — even without the admin UI, this is a real, working portfolio

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Validate → Deploy/Demo (MVP!)
3. Add User Story 2 → Validate → Deploy/Demo (owner can now self-serve project updates)
4. Add User Story 3 → Validate → Deploy/Demo (About/Skills/Contact complete the site)
5. Polish → Deploy final version

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing the corresponding behavior
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently
