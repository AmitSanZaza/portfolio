import Link from "next/link";
import { getProfileContent } from "@/lib/profile-content";

export async function Footer() {
  const { name, contactMethod, links } = await getProfileContent();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm text-zinc-500 sm:px-8 dark:text-zinc-400">
        <p>
          © {new Date().getFullYear()} {name}
        </p>
        <ul className="flex flex-wrap items-center gap-4">
          {[contactMethod, ...links].map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                {...(link.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="hover:text-zinc-950 dark:hover:text-zinc-50"
              >
                {link.href.startsWith("mailto:") ? "Email" : link.label}
              </a>
            </li>
          ))}
          <li>
            {/* Kept out of the main nav: visitors don't need it, the owner
                just needs a way in. */}
            <Link
              href="/admin/login"
              className="hover:text-zinc-950 dark:hover:text-zinc-50"
            >
              Admin
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
