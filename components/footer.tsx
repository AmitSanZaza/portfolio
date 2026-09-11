import Link from "next/link";
import { getProfileContent } from "@/lib/profile-content";

export async function Footer() {
  const { contactMethod } = await getProfileContent();

  return (
    <footer className="border-t border-ash">
      <div className="container-page flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-8 text-[13px] text-smoke">
        <span>© {new Date().getFullYear()} Amit Barua</span>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a href={contactMethod.href} className="link">
            {contactMethod.label}
          </a>
          <Link href="/design" className="link">
            Design system
          </Link>
        </div>
      </div>
    </footer>
  );
}
