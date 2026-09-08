# Quickstart: Portfolio Site

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md) | **Contracts**: [contracts/admin-actions.md](./contracts/admin-actions.md)

This is a manual, end-to-end validation guide — it proves the feature works by walking through the same scenarios as the spec's acceptance criteria. It is not a substitute for the unit tests in `tests/unit/`, and it does not contain implementation code (see `plan.md` for structure, `tasks.md` for build steps).

## Prerequisites

- Node.js 20 LTS and a package manager (npm/pnpm) installed.
- A free [Supabase](https://supabase.com) project created, with:
  - A `projects` table matching [data-model.md](./data-model.md)'s `Project` fields, and RLS policies: public `SELECT`, `INSERT`/`UPDATE`/`DELETE` restricted to authenticated users.
  - A Storage bucket for project images (public read).
  - One Auth user created for the owner (email/password) — this is the only login the admin area will accept, per the spec's single-owner assumption.
- Environment variables set (e.g., in `.env.local`): Supabase project URL and anon key, per `lib/supabase/client.ts` / `server.ts`.
- A free [Vercel](https://vercel.com) account connected to the repository, for deployment validation.

## Setup

```bash
npm install
npm run dev
```

Site should be reachable at `http://localhost:3000`.

## Scenario 1 — Visitor browses the project showcase (US1, P1)

1. With zero rows in the `projects` table, open the home page.
   - **Expected**: Empty-state message is shown, not a blank/broken layout (FR-003).
2. Insert one project row directly in Supabase (title, description, image, a couple of `technologies`, a `demo_url`, a `source_url`) and reload the home page.
   - **Expected**: A project card shows the title, image, description, and technology tags (FR-001).
3. Click the demo link, then the source link (open in new tab).
   - **Expected**: Both open the correct destinations (FR-002).

## Scenario 2 — Owner manages projects without touching code (US2, P2)

1. Visit `/admin/projects` while logged out.
   - **Expected**: Redirected to `/admin/login` — the admin area is not reachable without authentication (FR-004, FR-011).
2. Log in with the owner's Supabase Auth credentials.
   - **Expected**: Redirected to `/admin/projects`, showing existing projects.
3. Open "New project", submit the form with an empty title.
   - **Expected**: Submission is rejected; the field error explains the title is required (FR-006).
4. Fill in all required fields (title, description) plus optional image/technologies/links, submit.
   - **Expected**: Redirected back to the list; the new project appears. Reload the public home page — the project is visible there too (FR-005, FR-007).
5. Edit that project's description, save.
   - **Expected**: Public home page reflects the updated description.
6. Delete the project.
   - **Expected**: It disappears from both the admin list and the public home page (FR-007).
7. Log out, then try to hit the admin URL again.
   - **Expected**: Redirected to `/admin/login` again.

## Scenario 3 — Visitor learns about the owner and can reach out (US3, P3)

1. Navigate to the About page.
   - **Expected**: Owner's bio is displayed (FR-008).
2. Navigate to the Skills page/section.
   - **Expected**: List of skills is displayed (FR-009).
3. Navigate to the Contact page/section.
   - **Expected**: At least one working contact method is shown (e.g., a `mailto:` link opens the visitor's mail client) (FR-010).

## Cross-cutting checks

- **Responsive layout (FR-012/SC-004)**: Resize the browser to a mobile width (or use device emulation) and repeat Scenario 1 — cards, nav, and admin forms should remain readable and usable with no horizontal scrolling.
- **Broken image fallback (Edge Case)**: Set a project's `image_url` to a non-existent path and reload — a placeholder should render instead of a broken image icon.
- **Invalid link rejected (Edge Case)**: In the admin form, submit a `demo_url` like `not-a-url` — submission should be rejected with an explanation, not saved as-is.
- **Wrong login credentials (Edge Case)**: Attempt `/admin/login` with an incorrect password — error message should be generic, not confirming/denying whether the email exists.

## Deployment validation

1. Push the branch, deploy to Vercel (or use `vercel --prod` if the owner has the CLI set up), with the same Supabase environment variables configured in the Vercel project settings.
2. Repeat Scenario 1 and the login step of Scenario 2 against the deployed URL to confirm the production environment is wired correctly end-to-end.
