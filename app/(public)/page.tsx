import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { getProjects } from "@/app/actions/projects";
import { getProfileContent } from "@/lib/profile-content";
import { ProjectCard } from "@/components/project-card";
import { EmptyState } from "@/components/empty-state";

// If the database is unreachable (e.g. a paused free-tier Supabase project),
// keep the intro visible and degrade only the projects section.
async function getProjectsOrNull() {
  try {
    return await getProjects();
  } catch (error) {
    // Let Next.js's own control-flow errors (dynamic rendering bailout,
    // redirects) through; only real data failures are handled here.
    unstable_rethrow(error);
    console.error(error);
    return null;
  }
}

export default async function HomePage() {
  const [projects, { name, tagline }] = await Promise.all([
    getProjectsOrNull(),
    getProfileContent(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-12 sm:px-8">
      <section className="mb-12 flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {name}
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          {tagline}
        </p>
        <div className="flex flex-wrap gap-3 text-sm font-medium">
          <Link
            href="/contact"
            className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-50 dark:text-zinc-900"
          >
            Get in touch
          </Link>
          <Link
            href="/about"
            className="rounded border border-zinc-300 px-4 py-2 hover:border-zinc-500 dark:border-zinc-700 dark:hover:border-zinc-500"
          >
            About me
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="projects-heading"
        className="flex flex-1 flex-col"
      >
        <h2 id="projects-heading" className="mb-6 text-xl font-semibold">
          Projects
        </h2>
        {projects === null ? (
          <EmptyState
            title="Projects are temporarily unavailable"
            description="Please check back in a few minutes."
          />
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Check back soon — projects showcased here are on their way."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
