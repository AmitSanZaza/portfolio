import Link from "next/link";
import { getProjects } from "@/app/actions/projects";
import { getProfileContent } from "@/lib/profile-content";
import { ProjectCard } from "@/components/project-card";
import { EmptyState } from "@/components/empty-state";
import { Reveal } from "@/components/reveal";

export default async function HomePage() {
  const [projects, { headline, tagline, contactMethod }] = await Promise.all([
    getProjects(),
    getProfileContent(),
  ]);

  return (
    <>
      {/* Hero — one idea, one action. */}
      <section className="container-page flex min-h-[70vh] flex-col justify-center gap-8 py-20 sm:py-28">
        <div className="hero-recede flex flex-col gap-8">
          <Reveal>
            <p className="eyebrow">Computer science student · Web developer</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="display max-w-4xl">{headline}</h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="max-w-xl text-[17px] leading-relaxed text-graphite">
              {tagline}
            </p>
          </Reveal>
          <Reveal
            delay={240}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <a href="#projects" className="btn btn-primary">
              See the projects <span aria-hidden>→</span>
            </a>
            <Link href="/contact" className="btn btn-ghost">
              Get in touch
            </Link>
          </Reveal>
        </div>
      </section>

      <hr className="border-ash" />

      {/* Projects — the one thing the page exists to show. */}
      <section
        id="projects"
        className="container-page scroll-mt-28 py-16 sm:py-24"
      >
        <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
          <Reveal className="pin-aside flex flex-col gap-3">
            <p className="eyebrow">Selected work</p>
            <h2 className="text-[40px] leading-[1.15]">Projects</h2>
            <p className="max-w-[24ch] text-[14px] text-smoke">
              Built end to end, shipped, and open to click around.
            </p>
          </Reveal>

          {projects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              description="Check back soon — projects showcased here are on their way."
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {projects.map((project, i) => (
                <Reveal key={project.id} delay={(i % 2) * 90}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <hr className="border-ash" />

      {/* Contact — one ask, then the page ends. */}
      <section className="container-page py-16 sm:py-24">
        <Reveal className="card flex flex-col gap-6 px-6 py-12 sm:px-12 sm:py-16">
          <p className="eyebrow">Building something?</p>
          <h2 className="max-w-2xl text-[40px] leading-[1.15] sm:text-[48px]">
            Need a developer who finishes what he starts?
          </h2>
          <p className="max-w-xl text-graphite">
            One email is enough. I reply to every message.
          </p>
          <div>
            <a href={contactMethod.href} className="btn btn-primary">
              {contactMethod.label}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
