import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";
import { getProfileContent } from "@/lib/profile-content";
import { NavLink } from "@/components/nav-link";

const links = [
  { href: "/", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/contact", label: "Contact" },
];

export async function Nav() {
  const supabase = await createClient();
  const [
    {
      data: { user },
    },
    { name },
  ] = await Promise.all([supabase.auth.getUser(), getProfileContent()]);

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4 sm:px-8"
      >
        <Link href="/" className="font-semibold tracking-tight">
          {name}
        </Link>
        <ul className="flex flex-wrap items-center gap-4 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <NavLink href={link.href} label={link.label} />
            </li>
          ))}
          {user && (
            <li className="flex items-center gap-4">
              <NavLink href="/admin/projects" label="Admin" />
              <form action={logout}>
                <button
                  type="submit"
                  className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Log out
                </button>
              </form>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
