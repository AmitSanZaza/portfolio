# Contracts: Admin Server Actions

**Feature**: [spec.md](../spec.md) | **Plan**: [plan.md](../plan.md) | **Data model**: [data-model.md](../data-model.md)

This app has no public REST/GraphQL API — the UI (public pages and admin forms) is the only consumer of these interfaces. Since data mutations are implemented as Next.js Server Actions (see [research.md](../research.md)), the "contract" is the function signature each form calls, its authorization rule, and its result shape. These are the interfaces `/speckit-tasks` should turn into concrete implementation + test tasks.

## Auth

### `login(formData: { email: string; password: string }) → { ok: true } | { ok: false; error: string }`

- **Maps to**: FR-004
- **Behavior**: Delegates credential check to Supabase Auth. On success, establishes a session (cookie via `@supabase/ssr`) and the caller redirects to `/admin/projects`. On failure, returns a generic error (`"Invalid email or password"`) — does not reveal whether the email exists (Edge Cases: no info leak on bad credentials).

### `logout() → void`

- **Maps to**: FR-004
- **Behavior**: Clears the Supabase session; redirects to `/admin/login`.

### Authorization guard: `requireOwnerSession()`

- **Maps to**: FR-011
- **Behavior**: Called at the top of every action below and every `app/admin/*` server component. Throws/redirects to `/admin/login` if there is no valid Supabase session. This is the single choke point that satisfies "System MUST prevent unauthenticated users from creating, editing, or deleting project content."

## Project management (all require `requireOwnerSession()` to pass first)

### `createProject(input: ProjectInput) → { ok: true; project: Project } | { ok: false; fieldErrors: Record<string, string> }`

- **Maps to**: FR-005, FR-006; US2 acceptance scenarios 2, 5
- **`ProjectInput`**: `{ title: string; description: string; imageFile?: File; technologies: string[]; demoUrl?: string; sourceUrl?: string }`
- **Behavior**:
  1. Validate `input` against the Zod schema (`lib/validation/project.ts`) per the rules in `data-model.md`. On failure, return `fieldErrors` keyed by field name — the form displays these inline (FR-006, Edge Case: explains what's missing/invalid).
  2. If `imageFile` provided, upload to Supabase Storage; store the resulting public URL as `image_url`.
  3. Insert the `Project` row.
  4. On success, the public project list reflects the new project on next read (FR-007) — no separate publish step.

### `updateProject(id: string, input: ProjectInput) → { ok: true; project: Project } | { ok: false; fieldErrors: Record<string, string> } | { ok: false; error: "not_found" }`

- **Maps to**: FR-005, FR-006; US2 acceptance scenario 3
- **Behavior**: Same validation/upload path as `createProject`, applied to an existing row (`updated_at` refreshed). Returns `not_found` if `id` doesn't exist (defensive — not a spec-driven scenario, just a safe default).

### `deleteProject(id: string) → { ok: true } | { ok: false; error: "not_found" }`

- **Maps to**: FR-005; US2 acceptance scenario 4
- **Behavior**: Removes the row. The project immediately stops appearing on the public list (FR-007).

## Public data reads (no auth required)

### `getProjects() → Project[]`

- **Maps to**: FR-001, FR-003; US1 acceptance scenarios 1, 3
- **Behavior**: Returns all projects ordered by `display_order`. Called by the home page. An empty array is the trigger for the UI's empty-state message (FR-003) — this contract does not render UI, it just returns the (possibly empty) list.

### `getProfileContent() → { bio: string; skills: string[]; contactMethod: string }`

- **Maps to**: FR-008, FR-009, FR-010; US3
- **Behavior**: Reads the static Profile Content described in `data-model.md`. No database round-trip required (may be a plain import), but kept as a named function so the About/Skills/Contact pages don't depend on the content's storage shape directly — see `data-model.md`'s note on promoting this to a table later without changing callers.
