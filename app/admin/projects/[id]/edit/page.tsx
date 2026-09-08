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
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-12 sm:px-8">
      <h1 className="text-xl font-semibold">Edit project</h1>
      <ProjectForm
        action={updateProjectForId}
        project={project}
        submitLabel="Save changes"
      />
    </div>
  );
}
