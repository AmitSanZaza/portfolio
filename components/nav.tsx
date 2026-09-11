import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";

const links = [
  { href: "/", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/contact", label: "Contact" },
];

export async function Nav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b border-ash">
      <nav className="container-page flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-5">
        <Link href="/" className="nav-link !text-ink">
          Amit Barua
        </Link>
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="nav-link">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            {user ? (
              <div className="flex items-center gap-6">
                <Link href="/admin/projects" className="nav-link">
                  Admin
                </Link>
                <form action={logout}>
                  <button type="submit" className="nav-link">
                    Log out
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/admin/login" className="nav-link">
                Admin
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
