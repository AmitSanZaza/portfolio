import { getProfileContent } from "@/lib/profile-content";

export default async function AboutPage() {
  const { bio } = await getProfileContent();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-8">
      <h1 className="mb-4 text-xl font-semibold">About</h1>
      <p className="whitespace-pre-line text-zinc-700 dark:text-zinc-300">
        {bio}
      </p>
    </div>
  );
}
