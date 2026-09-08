import Link from "next/link";
import { requireOwnerSession } from "@/lib/auth/session";
import { getProjects } from "@/app/actions/projects";
import { DeleteProjectButton } from "@/components/delete-project-button";

export default async function AdminProjectsPage() {
  await requireOwnerSession();
  const projects = await getProjects();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-12 sm:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Manage projects</h1>
        <Link
          href="/admin/projects/new"
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
        >
          New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No projects yet — add your first one.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <span className="font-medium">{project.title}</span>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Edit
                </Link>
                <DeleteProjectButton
                  projectId={project.id}
                  projectTitle={project.title}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
