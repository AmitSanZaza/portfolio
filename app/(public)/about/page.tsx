import { getProfileContent } from "@/lib/profile-content";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { ScrubText } from "@/components/scrub-text";

export default async function AboutPage() {
  const { bio } = await getProfileContent();

  return (
    <div className="container-page py-16 sm:py-24">
      <PageHeader eyebrow="Who's behind this" title="About" />
      <Reveal delay={120}>
        <ScrubText
          text={bio}
          className="max-w-2xl text-[19px] leading-relaxed sm:text-[22px]"
        />
      </Reveal>
    </div>
  );
}
