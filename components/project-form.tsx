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

      <label className="flex flex-col gap-2 text-[13px] text-ink">
        Description
        <textarea
          name="description"
          defaultValue={project?.description}
          required
          rows={4}
          className="input"
        />
        {state?.fieldErrors.description && (
          <FieldError message={state.fieldErrors.description} />
        )}
      </label>

      <label className="flex flex-col gap-2 text-[13px] text-ink">
        Image
        <input type="file" name="image" accept="image/*" className="input" />
        {project?.image_url && (
          <span className="text-[12px] text-smoke">
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
        <p role="alert" className="text-[13px] text-danger">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn btn-dark self-start"
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
    <label className="flex flex-col gap-2 text-[13px] text-ink">
      {label}
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="input"
      />
      {error && <FieldError message={error} />}
    </label>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <span role="alert" className="text-[12px] text-danger">
      {message}
    </span>
  );
}
