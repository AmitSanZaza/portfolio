import Link from "next/link";
import { getProjects } from "@/app/actions/projects";
import { getProfileContent } from "@/lib/profile-content";
import { ProjectCard } from "@/components/project-card";
import { EmptyState } from "@/components/empty-state";

export default async function HomePage() {
  const [projects, { headline, tagline }] = await Promise.all([
    getProjects(),
    getProfileContent(),
  ]);

  return (
    <>
      {/* Hero — one idea, one action. */}
      <section className="container-page flex min-h-[70vh] flex-col justify-center gap-8 py-20 sm:py-28">
        <p className="eyebrow">Computer science student · Web developer</p>
        <h1 className="display max-w-4xl">{headline}</h1>
        <p className="max-w-xl text-[17px] leading-relaxed text-graphite">
          {tagline}
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a href="#projects" className="btn btn-primary">
            See the projects <span aria-hidden>→</span>
          </a>
          <Link href="/contact" className="btn btn-ghost">
            Get in touch
          </Link>
        </div>
      </section>

      <hr className="border-ash" />

      {/* Projects — the one thing the page exists to show. */}
      <section
        id="projects"
        className="container-page scroll-mt-8 py-16 sm:py-24"
      >
        <div className="mb-10 flex flex-col gap-3">
          <p className="eyebrow">Selected work</p>
          <h2 className="text-[40px] leading-[1.15]">Projects</h2>
        </div>

        {projects.length === 0 ? (
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
    </>
  );
}
