# Phase 1 Data Model: Portfolio Site

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

Derived from the Key Entities in the spec, using the storage decision in [research.md](./research.md) (Supabase Postgres).

## Entity: Project

Represents one showcased piece of work (spec Key Entities → Project; FR-001, FR-002, FR-005, FR-006).

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | UUID | yes (generated) | Primary key |
| `title` | text | yes | FR-006: rejected at save time if empty |
| `description` | text | yes | FR-006: rejected at save time if empty |
| `image_url` | text | no | Points to a file in Supabase Storage; falls back to a placeholder in the UI when absent or broken (Edge Cases) |
| `technologies` | text[] | no | Free-form tags (e.g., `["Next.js", "TypeScript"]`); empty list allowed |
| `demo_url` | text | no | Must be a well-formed URL when present (FR-006 edge case: invalid link rejected) |
| `source_url` | text | no | Must be a well-formed URL when present (same validation as `demo_url`) |
| `display_order` | integer | yes (defaulted) | Controls ordering on the public list; defaults to creation order |
| `created_at` | timestamptz | yes (generated) | Set on insert |
| `updated_at` | timestamptz | yes (generated) | Set on insert, refreshed on update |

**Validation rules** (enforced server-side via the Zod schema in `lib/validation/project.ts`, per FR-006):
- `title`: required, non-empty, reasonable max length (e.g., 120 chars) so cards render predictably.
- `description`: required, non-empty, reasonable max length (e.g., 2000 chars).
- `demo_url` / `source_url`: when provided, must parse as a valid absolute URL.
- `technologies`: each tag non-empty, reasonable max count/length to avoid layout overflow.

**State/lifecycle**: No workflow states — a project simply exists (created), can be updated in place, or is deleted (US2 acceptance scenarios 2–4). Deleting a `Project` removes it from the public list immediately (FR-007).

**Relationships**: None to other entities — `Project` is a standalone record scoped to the single owner (no per-project ownership field needed since there is exactly one admin, per the spec's Assumptions).

## Entity: Owner Account

Represents the single site owner's credentials (spec Key Entities → Owner Account; FR-004, FR-011).

Handled entirely by Supabase Auth rather than a custom table — the "entity" here is the one user record Supabase Auth manages for the owner's email/password. No profile fields beyond what Supabase Auth stores are needed, since the spec's Assumptions rule out multi-user roles/permissions.

| Field | Type | Notes |
|---|---|---|
| `email` | text | Login identifier, set once during initial setup |
| `password` | (hashed, managed by Supabase Auth) | Never stored or handled directly by application code |

**Validation rules**: Delegated to Supabase Auth (standard email/password checks). Application code only checks *is there a valid authenticated session* before allowing any Project write (FR-011) — it does not implement its own credential storage or hashing (see research.md's rejection of hand-rolled auth).

## Entity: Profile Content

Represents the About bio, Skills list, and Contact info shown to visitors (spec Key Entities → Profile Content; FR-008, FR-009, FR-010).

Per the spec's Assumptions, this content is set up as part of building the site and does not go through the same add/edit/delete admin workflow as Projects. It is therefore modeled as static content in the codebase (e.g., a small typed config object or constants file) rather than a database table:

| Field | Type | Notes |
|---|---|---|
| `bio` | text | Shown on the About section (FR-008) |
| `skills` | text[] | Shown on the Skills section (FR-009) |
| `contact_method` | text (e.g., `mailto:` link or social URL) | Shown on the Contact section (FR-010) |

If the owner later wants this editable through the admin UI too, it can be promoted to a Supabase table following the same pattern as `Project` — noted here as a natural extension point, not built now (keeps scope matched to the spec).

## Access control summary (ties back to FR-011 / SC-005)

- Public routes (`app/(public)/*`) only ever *read* `Project` rows — no write path is reachable without authentication.
- All `Project` writes (create/update/delete) go through Server Actions in `app/actions/projects.ts`, which first verify a valid Supabase Auth session (`lib/auth/session.ts`) before touching the database.
- Supabase Row Level Security (RLS) policies on the `projects` table provide a second, data-layer enforcement of the same rule (public read allowed, write restricted to the authenticated owner), so unauthorized writes are blocked even if application-layer checks were ever bypassed.
