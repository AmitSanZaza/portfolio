import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSiteOwner } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  // Already signed in as the owner: skip the form.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user && (await isSiteOwner(supabase))) {
    redirect("/admin/projects");
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-xl font-semibold">Owner login</h1>
      <LoginForm />
    </div>
  );
}
