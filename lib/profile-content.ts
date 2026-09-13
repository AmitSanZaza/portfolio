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
    "I’m Amit Barua, a computer science student. I design, build and deploy full-stack apps with Next.js, TypeScript and Supabase. Every project below is live: open it, click around, read the code.",
  bio: `I’m Amit Barua, a computer science student. I build web applications from the database schema to the last pixel.

Next.js, TypeScript, React and Tailwind CSS in front; Supabase for auth, data and storage behind. This site is one of those projects: the home page reads from a database, through an admin area I wrote, not from a hard-coded list.

Finished, to me, means the error states are handled, the edge cases are tested and it is deployed. That is the bar for everything on the home page.`,
  skills: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Supabase"],
  contactMethod: {
    label: "amit15barua@gmail.com",
    href: "mailto:amit15barua@gmail.com",
  },
};

export async function getProfileContent(): Promise<ProfileContent> {
  return profileContent;
}
