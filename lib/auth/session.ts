import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

// True only for users listed in public.site_owners (see supabase/schema.sql).
// Being signed in is not enough: Supabase sign-ups may be open to anyone.
export async function isSiteOwner(supabase: SupabaseServerClient) {
  const { data, error } = await supabase.rpc("is_site_owner");
  return !error && data === true;
}

// Guards every admin page/action (FR-004, FR-011): redirects to the login
// page unless there is a valid Supabase Auth session for the owner.
export async function requireOwnerSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await isSiteOwner(supabase))) {
    redirect("/admin/login");
  }

  return user;
}
