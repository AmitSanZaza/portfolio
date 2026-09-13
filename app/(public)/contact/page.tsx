import { getProfileContent } from "@/lib/profile-content";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";

export default async function ContactPage() {
  const { contactMethod } = await getProfileContent();

  return (
    <div className="container-page py-16 sm:py-24">
      <PageHeader eyebrow="One email away" title="Contact" />
      <Reveal delay={120}>
        <p className="max-w-xl text-[17px] leading-relaxed text-graphite">
          Say what you are building and where you are stuck. A few lines are
          enough.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href={contactMethod.href} className="btn btn-primary">
            Email me <span aria-hidden>→</span>
          </a>
          <a href={contactMethod.href} className="link link-block text-[14px]">
            {contactMethod.label}
          </a>
        </div>
      </Reveal>
    </div>
  );
}
