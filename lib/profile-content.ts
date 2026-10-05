// Edit this file with your own information — it powers the home page intro
// and the About, Skills, and Contact pages (FR-008, FR-009, FR-010). See
// data-model.md's "Profile Content" entity for why this isn't part of the
// admin CRUD workflow.

export type ProfileLink = {
  label: string;
  href: string;
};

export type ProfileContent = {
  name: string;
  tagline: string;
  bio: string;
  skills: string[];
  contactMethod: ProfileLink;
  // Extra profiles (GitHub, LinkedIn, …) shown on the Contact page and footer.
  links: ProfileLink[];
};

const profileContent: ProfileContent = {
  name: "Amit Barua",
  tagline:
    "Computer science student building fast, accessible web apps with Next.js and TypeScript.",
  bio: "Hi, I'm Amit Barua — a computer science student passionate about web development. I enjoy building projects with Next.js and TypeScript, and I'm always looking to learn more and take on new challenges.",
  skills: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
  contactMethod: {
    label: "amit15barua@gmail.com",
    href: "mailto:amit15barua@gmail.com",
  },
  links: [{ label: "GitHub", href: "https://github.com/AmitSanZaza" }],
};

export async function getProfileContent(): Promise<ProfileContent> {
  return profileContent;
}
