import { getProjects } from "@/app/actions/projects";
import { ProjectCard } from "@/components/project-card";
import { EmptyState } from "@/components/empty-state";

export default async function HomePage() {
  const projects = await getProjects();

  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects yet"
        description="Check back soon — projects showcased here are on their way."
      />
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-6 px-4 py-12 sm:grid-cols-2 sm:px-8">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
