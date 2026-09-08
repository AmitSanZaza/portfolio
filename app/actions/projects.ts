"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireOwnerSession } from "@/lib/auth/session";
import {
  validateProject,
  type ProjectFieldErrors,
} from "@/lib/validation/project";
import type { Project } from "@/lib/types";

// Public read — no authentication required (FR-001, FR-003).
export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to load projects: ${error.message}`);
  }

  return data ?? [];
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load project: ${error.message}`);
  }

  return data;
}

export type ProjectFormState = {
  fieldErrors: ProjectFieldErrors;
  error?: string;
} | null;

function parseProjectFormData(formData: FormData) {
  const technologies = String(formData.get("technologies") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    technologies,
    demo_url: String(formData.get("demo_url") ?? ""),
    source_url: String(formData.get("source_url") ?? ""),
  };
}

async function uploadImageIfProvided(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData,
): Promise<string | undefined> {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return undefined;
  }

  const path = `${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage
    .from("project-images")
    .upload(path, file, { contentType: file.type });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("project-images").getPublicUrl(path);

  return publicUrl;
}

async function nextDisplayOrder(
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<number> {
  const { data } = await supabase
    .from("projects")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data?.display_order ?? 0) + 1;
}

// Create/edit/delete all require an authenticated owner session (FR-011).

export async function createProject(
  _prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireOwnerSession();

  const parsed = validateProject(parseProjectFormData(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.fieldErrors };
  }

  const supabase = await createClient();

  let image_url: string | undefined;
  try {
    image_url = await uploadImageIfProvided(supabase, formData);
  } catch (err) {
    return {
      fieldErrors: {},
      error: err instanceof Error ? err.message : "Image upload failed.",
    };
  }

  const { error } = await supabase.from("projects").insert({
    ...parsed.data,
    image_url,
    display_order: await nextDisplayOrder(supabase),
  });

  if (error) {
    return {
      fieldErrors: {},
      error: `Failed to save project: ${error.message}`,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function updateProject(
  id: string,
  _prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireOwnerSession();

  const parsed = validateProject(parseProjectFormData(formData));
  if (!parsed.success) {
    return { fieldErrors: parsed.fieldErrors };
  }

  const supabase = await createClient();

  let image_url: string | undefined;
  try {
    image_url = await uploadImageIfProvided(supabase, formData);
  } catch (err) {
    return {
      fieldErrors: {},
      error: err instanceof Error ? err.message : "Image upload failed.",
    };
  }

  const { error } = await supabase
    .from("projects")
    .update({
      ...parsed.data,
      ...(image_url ? { image_url } : {}),
    })
    .eq("id", id);

  if (error) {
    return {
      fieldErrors: {},
      error: `Failed to save project: ${error.message}`,
    };
  }

  revalidatePath("/");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function deleteProject(formData: FormData): Promise<void> {
  await requireOwnerSession();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("projects").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/projects");
}
