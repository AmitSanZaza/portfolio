import { requireOwnerSession } from "@/lib/auth/session";
import { createProject } from "@/app/actions/projects";
import { ProjectForm } from "@/components/project-form";

export default async function NewProjectPage() {
  await requireOwnerSession();

  return (
    <div className="container-page flex flex-col gap-8 py-16">
      <h1 className="text-[40px] leading-[1.15]">New project</h1>
      <ProjectForm action={createProject} submitLabel="Create project" />
    </div>
  );
}
