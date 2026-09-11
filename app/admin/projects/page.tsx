import Link from "next/link";
import { requireOwnerSession } from "@/lib/auth/session";
import { getProjects } from "@/app/actions/projects";
import { DeleteProjectButton } from "@/components/delete-project-button";

export default async function AdminProjectsPage() {
  await requireOwnerSession();
  const projects = await getProjects();

  return (
    <div className="container-page flex max-w-3xl flex-col gap-8 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-[40px] leading-[1.15]">Manage projects</h1>
        <Link href="/admin/projects/new" className="btn btn-dark">
          New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-[14px] text-smoke">
          No projects yet — add your first one.
        </p>
      ) : (
        <ul className="card flex flex-col divide-y divide-ash px-6">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex items-center justify-between gap-4 py-4"
            >
              <span className="text-ink">{project.title}</span>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  className="link text-[13px] text-ink"
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
