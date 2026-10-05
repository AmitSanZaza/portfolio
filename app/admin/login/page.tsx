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
    <div className="container-page flex flex-1 flex-col justify-center gap-8 py-16">
      <h1 className="text-[40px] leading-[1.15]">Owner login</h1>
      <LoginForm />
    </div>
  );
}
