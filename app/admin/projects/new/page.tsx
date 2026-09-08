import { requireOwnerSession } from "@/lib/auth/session";
import { createProject } from "@/app/actions/projects";
import { ProjectForm } from "@/components/project-form";

export default async function NewProjectPage() {
  await requireOwnerSession();

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-12 sm:px-8">
      <h1 className="text-xl font-semibold">New project</h1>
      <ProjectForm action={createProject} submitLabel="Create project" />
    </div>
  );
}
