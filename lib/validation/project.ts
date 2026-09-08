import { z } from "zod";

// Treats an empty string (an untouched optional form field) as "not provided".
const optionalUrl = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z
    .url({ message: "Must be a valid URL, e.g. https://example.com" })
    .optional(),
);

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(120, "Title must be 120 characters or fewer"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(2000, "Description must be 2000 characters or fewer"),
  technologies: z
    .array(
      z
        .string()
        .trim()
        .min(1, "A technology tag cannot be empty")
        .max(40, "A technology tag must be 40 characters or fewer"),
    )
    .max(20, "Add at most 20 technology tags")
    .default([]),
  demo_url: optionalUrl,
  source_url: optionalUrl,
});

export type ProjectInput = z.infer<typeof projectSchema>;

export type ProjectFieldErrors = Partial<Record<keyof ProjectInput, string>>;

export function validateProject(
  input: unknown,
):
  | { success: true; data: ProjectInput }
  | { success: false; fieldErrors: ProjectFieldErrors } {
  const result = projectSchema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const fieldErrors: ProjectFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in fieldErrors)) {
      fieldErrors[field as keyof ProjectInput] = issue.message;
    }
  }
  return { success: false, fieldErrors };
}
