import { getProfileContent } from "@/lib/profile-content";
import { PageHeader } from "@/components/page-header";

export default async function ContactPage() {
  const { contactMethod } = await getProfileContent();

  return (
    <div className="container-page max-w-3xl py-16 sm:py-24">
      <PageHeader eyebrow="One email away" title="Contact" />
      <p className="max-w-xl text-[17px] leading-relaxed text-graphite">
        Building something and need a developer? Write to me — I reply to every
        message.
      </p>
      <a href={contactMethod.href} className="btn btn-primary mt-8">
        {contactMethod.label}
      </a>
    </div>
  );
}
