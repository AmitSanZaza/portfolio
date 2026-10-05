import type { Metadata } from "next";
import { getProfileContent } from "@/lib/profile-content";

export const metadata: Metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const { contactMethod, links } = await getProfileContent();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-8">
      <h1 className="mb-4 text-xl font-semibold">Contact</h1>
      <p className="text-zinc-700 dark:text-zinc-300">
        Reach out at{" "}
        <a
          href={contactMethod.href}
          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          {contactMethod.label}
        </a>
        .
      </p>
      {links.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-4 text-sm font-medium">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
