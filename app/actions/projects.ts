"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireOwnerSession } from "@/lib/auth/session";
import {
  ALLOWED_IMAGE_TYPES,
  validateImage,
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

const IMAGE_BUCKET = "project-images";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function uploadImageIfProvided(
  supabase: SupabaseServerClient,
  formData: FormData,
): Promise<string | undefined> {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return undefined;
  }

  const invalid = validateImage(file);
  if (invalid) {
    throw new Error(invalid);
  }

  // Never reuse the client-supplied filename: it can contain characters that
  // break URLs or collide. The extension comes from the validated MIME type.
  const path = `${crypto.randomUUID()}.${ALLOWED_IMAGE_TYPES[file.type]}`;
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);

  return publicUrl;
}

// Best-effort removal of an image this app uploaded, so replaced or deleted
// projects don't leave orphaned files in Storage. Failures are ignored: a
// stray file is harmless, a failed save because of it would not be.
async function removeStoredImage(
  supabase: SupabaseServerClient,
  publicUrl: string | null | undefined,
) {
  const marker = `/storage/v1/object/public/${IMAGE_BUCKET}/`;
  const index = publicUrl?.indexOf(marker) ?? -1;
  if (!publicUrl || index === -1) return;

  const path = decodeURIComponent(publicUrl.slice(index + marker.length));
  await supabase.storage.from(IMAGE_BUCKET).remove([path]);
}

async function nextDisplayOrder(
  supabase: SupabaseServerClient,
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
    await removeStoredImage(supabase, image_url);
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
  const existing = await getProject(id);
  if (!existing) {
    return { fieldErrors: {}, error: "This project no longer exists." };
  }

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
    await removeStoredImage(supabase, image_url);
    return {
      fieldErrors: {},
      error: `Failed to save project: ${error.message}`,
    };
  }

  if (image_url) {
    await removeStoredImage(supabase, existing.image_url);
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
  const { data: deleted, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .select("image_url")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to delete project: ${error.message}`);
  }

  await removeStoredImage(supabase, deleted?.image_url);

  revalidatePath("/");
  revalidatePath("/admin/projects");
}
