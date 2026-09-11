"use client";

import { deleteProject } from "@/app/actions/projects";

export function DeleteProjectButton({
  projectId,
  projectTitle,
}: {
  projectId: string;
  projectTitle: string;
}) {
  return (
    <form
      action={deleteProject}
      onSubmit={(event) => {
        if (
          !window.confirm(`Delete "${projectTitle}"? This can't be undone.`)
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={projectId} />
      <button type="submit" className="link text-[13px] text-danger">
        Delete
      </button>
    </form>
  );
}
