// Edit this file with your own information — it powers the home hero, About,
// Skills, and Contact pages (FR-008, FR-009, FR-010). See data-model.md's
// "Profile Content" entity for why this isn't part of the admin CRUD workflow.
//
// Copy rules (see ~/projets/MANUEL-SITE-WEB.md, level 4): one idea per
// section, specific over generic, no "passionate about", no "welcome to".

export type ProfileContent = {
  headline: string;
  tagline: string;
  bio: string;
  skills: string[];
  contactMethod: {
    label: string;
    href: string;
  };
};

const profileContent: ProfileContent = {
  headline: "Web apps, built end to end.",
  tagline:
    "I'm Amit Barua, a computer science student. I design, build and deploy full-stack projects with Next.js, TypeScript and Supabase — and I ship them so you can click around.",
  bio: `I'm Amit Barua, a computer science student who builds web applications from the database schema to the last pixel.

My tools are Next.js, TypeScript, React and Tailwind CSS, with Supabase for auth, data and storage. This site is one of those projects: every entry on the home page is managed through an admin area I built, not hard-coded.

If you're building something and need a developer who finishes what he starts, write to me.`,
  skills: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Supabase"],
  contactMethod: {
    label: "amit15barua@gmail.com",
    href: "mailto:amit15barua@gmail.com",
  },
};

export async function getProfileContent(): Promise<ProfileContent> {
  return profileContent;
}
