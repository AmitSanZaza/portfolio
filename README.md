# Portfolio Site

A personal portfolio: a public project showcase plus About/Skills/Contact pages, and a password-protected admin area to add, edit, and delete projects without touching code.

Built with Next.js (App Router, TypeScript), Supabase (database + auth + image storage), and Tailwind CSS. See `specs/001-portfolio-site/` for the full spec, plan, and design decisions.

## 1. One-time setup

### 1.1 Create a Supabase project

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, open **SQL Editor** and run the contents of `supabase/schema.sql` — this creates the `projects` table and its access policies.
3. In **Storage**, create a bucket named exactly `project-images` (any visibility setting is fine — the next step sets its access policy). Then run `supabase/storage.sql` in the SQL Editor to make it public-read and owner-write.
4. In **Authentication > Users**, add one user (your email + a password) — this is the only login the admin area accepts.
5. In **Project Settings > API**, copy the **Project URL** and the **anon public** key.

### 1.2 Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` with the values from step 1.1.5.

### 1.3 Personalize the static content

Edit `lib/profile-content.ts` with your own bio, skills, and contact info — these power the About/Skills/Contact pages and aren't managed through the admin UI (see `specs/001-portfolio-site/data-model.md` for why).

## 2. Run it locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Log into the admin area at `/admin/login` with the user you created in step 1.1.4, then add your first project at `/admin/projects/new`.

## 3. Everyday maintenance (the whole point of this project)

- **Add/edit/delete a project**: log in at `/admin/login`, then use `/admin/projects` — no code changes needed.
- **Update your bio/skills/contact**: edit `lib/profile-content.ts` and redeploy.

## 4. Useful commands

| Command          | What it does                        |
| ---------------- | ----------------------------------- |
| `npm run dev`    | Start the local dev server          |
| `npm run build`  | Production build (also type-checks) |
| `npm run test`   | Run the unit/integration tests      |
| `npm run lint`   | Lint the code                       |
| `npm run format` | Auto-format the code with Prettier  |

## 5. Deploying

1. Push this repository to GitHub (or your Git host of choice).
2. Import it into [Vercel](https://vercel.com/new).
3. In the Vercel project's settings, add the same two environment variables from `.env.local`.
4. Deploy. Every push to the main branch redeploys automatically.

## 6. Project structure

See `specs/001-portfolio-site/plan.md` ("Project Structure") for the full layout and rationale. In short:

- `app/(public)/` — the public pages (home/projects, about, skills, contact)
- `app/admin/` — the protected admin area
- `app/actions/` — Server Actions (data reads/writes, auth)
- `lib/` — Supabase clients, validation, auth guard, static profile content
- `components/` — shared UI
- `supabase/` — SQL to set up the database schema, RLS policies, and storage bucket
- `tests/` — unit and integration tests (Vitest + React Testing Library)
