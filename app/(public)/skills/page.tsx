import { getProfileContent } from "@/lib/profile-content";

export default async function SkillsPage() {
  const { skills } = await getProfileContent();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-8">
      <h1 className="mb-4 text-xl font-semibold">Skills</h1>
      {skills.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No skills listed yet.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {skill}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
