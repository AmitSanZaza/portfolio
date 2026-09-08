"use client";

import { useActionState } from "react";
import type { ProjectFormState } from "@/app/actions/projects";
import type { Project } from "@/lib/types";

type ProjectFormAction = (
  prevState: ProjectFormState,
  formData: FormData,
) => Promise<ProjectFormState>;

export function ProjectForm({
  action,
  project,
  submitLabel,
}: {
  action: ProjectFormAction;
  project?: Project;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field
        label="Title"
        name="title"
        defaultValue={project?.title}
        error={state?.fieldErrors.title}
        required
      />

      <label className="flex flex-col gap-1 text-sm">
        Description
        <textarea
          name="description"
          defaultValue={project?.description}
          required
          rows={4}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        {state?.fieldErrors.description && (
          <FieldError message={state.fieldErrors.description} />
        )}
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Image
        <input
          type="file"
          name="image"
          accept="image/*"
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
        {project?.image_url && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Leave empty to keep the current image.
          </span>
        )}
      </label>

      <Field
        label="Technologies (comma-separated)"
        name="technologies"
        defaultValue={project?.technologies.join(", ")}
        placeholder="Next.js, TypeScript, Tailwind CSS"
        error={state?.fieldErrors.technologies}
      />

      <Field
        label="Demo URL"
        name="demo_url"
        type="url"
        defaultValue={project?.demo_url ?? ""}
        placeholder="https://example.com"
        error={state?.fieldErrors.demo_url}
      />

      <Field
        label="Source code URL"
        name="source_url"
        type="url"
        defaultValue={project?.source_url ?? ""}
        placeholder="https://github.com/you/project"
        error={state?.fieldErrors.source_url}
      />

      {state?.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  error,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  error?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
      />
      {error && <FieldError message={error} />}
    </label>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <span role="alert" className="text-xs text-red-600 dark:text-red-400">
      {message}
    </span>
  );
}
