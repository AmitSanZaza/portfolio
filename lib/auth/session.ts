import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Guards every admin page/action (FR-004, FR-011): redirects to the login
// page unless there is a valid Supabase Auth session for the owner.
export async function requireOwnerSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return user;
}
