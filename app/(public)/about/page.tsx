import { getProfileContent } from "@/lib/profile-content";
import { PageHeader } from "@/components/page-header";

export default async function AboutPage() {
  const { bio } = await getProfileContent();

  return (
    <div className="container-page py-16 sm:py-24">
      <PageHeader eyebrow="Who's behind this" title="About" />
      <p className="max-w-2xl whitespace-pre-line text-[17px] leading-relaxed text-graphite">
        {bio}
      </p>
    </div>
  );
}
