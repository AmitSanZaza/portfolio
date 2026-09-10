// Edit this file with your own information — it powers the About, Skills,
// and Contact pages (FR-008, FR-009, FR-010). See data-model.md's "Profile
// Content" entity for why this isn't part of the admin CRUD workflow.

export type ProfileContent = {
  bio: string;
  skills: string[];
  contactMethod: {
    label: string;
    href: string;
  };
};

const profileContent: ProfileContent = {
  bio: "Hi, I'm Amit Barua — a computer science student passionate about web development. I enjoy building projects with Next.js and TypeScript, and I'm always looking to learn more and take on new challenges.",
  skills: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
  contactMethod: {
    label: "amit15barua@gmail.com",
    href: "mailto:amit15barua@gmail.com",
  },
};

export async function getProfileContent(): Promise<ProfileContent> {
  return profileContent;
}
