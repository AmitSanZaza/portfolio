export type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  technologies: string[];
  demo_url: string | null;
  source_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};
