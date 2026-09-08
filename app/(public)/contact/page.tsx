import { getProfileContent } from "@/lib/profile-content";

export default async function ContactPage() {
  const { contactMethod } = await getProfileContent();

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
    </div>
  );
}
