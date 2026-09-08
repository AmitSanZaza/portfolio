import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/types";

const baseProject: Project = {
  id: "1",
  title: "Cool Project",
  description: "A project that does cool things.",
  image_url: "https://example.com/image.png",
  technologies: ["Next.js", "TypeScript"],
  demo_url: "https://example.com/demo",
  source_url: "https://example.com/source",
  display_order: 0,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("ProjectCard", () => {
  it("renders title, description, technologies, and links", () => {
    render(<ProjectCard project={baseProject} />);

    expect(screen.getByText("Cool Project")).toBeInTheDocument();
    expect(
      screen.getByText("A project that does cool things."),
    ).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();

    const demoLink = screen.getByRole("link", { name: "Live demo" });
    expect(demoLink).toHaveAttribute("href", "https://example.com/demo");

    const sourceLink = screen.getByRole("link", { name: "Source code" });
    expect(sourceLink).toHaveAttribute("href", "https://example.com/source");
  });

  it("shows a placeholder instead of the image when no image_url is set", () => {
    render(<ProjectCard project={{ ...baseProject, image_url: null }} />);

    expect(screen.getByText("No image")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("falls back to a placeholder when the image fails to load", () => {
    render(<ProjectCard project={baseProject} />);

    const image = screen.getByRole("img");
    fireEvent.error(image);

    expect(screen.getByText("No image")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
