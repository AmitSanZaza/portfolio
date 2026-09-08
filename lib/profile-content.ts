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
  bio: "Hi, I'm [Your Name] — replace this with a short bio about who you are, what you build, and what you're looking for. Edit lib/profile-content.ts to update it.",
  skills: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
  contactMethod: {
    label: "your.email@example.com",
    href: "mailto:your.email@example.com",
  },
};

export async function getProfileContent(): Promise<ProfileContent> {
  return profileContent;
}
