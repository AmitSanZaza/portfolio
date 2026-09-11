import { getProfileContent } from "@/lib/profile-content";
import { PageHeader } from "@/components/page-header";

export default async function SkillsPage() {
  const { skills } = await getProfileContent();

  return (
    <div className="container-page max-w-3xl py-16 sm:py-24">
      <PageHeader eyebrow="What I work with" title="Skills" />
      {skills.length === 0 ? (
        <p className="text-[14px] text-smoke">No skills listed yet.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <li key={skill} className="tag !px-4 !py-2 !text-[13px]">
              {skill}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
