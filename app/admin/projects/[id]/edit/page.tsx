import { notFound } from "next/navigation";
import { requireOwnerSession } from "@/lib/auth/session";
import { getProject, updateProject } from "@/app/actions/projects";
import { ProjectForm } from "@/components/project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireOwnerSession();
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  const updateProjectForId = updateProject.bind(null, id);

  return (
    <div className="container-page flex max-w-xl flex-col gap-8 py-16">
      <h1 className="text-[40px] leading-[1.15]">Edit project</h1>
      <ProjectForm
        action={updateProjectForId}
        project={project}
        submitLabel="Save changes"
      />
    </div>
  );
}
