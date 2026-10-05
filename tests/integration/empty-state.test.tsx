import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/app/actions/projects", () => ({
  getProjects: vi.fn(async () => []),
}));

describe("Home page empty state", () => {
  it("shows an empty-state message when there are no projects", async () => {
    const { default: HomePage } = await import("@/app/(public)/page");

    render(await HomePage());

    expect(screen.getByText("No projects yet")).toBeInTheDocument();
  });
});

describe("Home page when projects can't be loaded", () => {
  it("keeps the intro and shows an unavailable message", async () => {
    const { getProjects } = await import("@/app/actions/projects");
    vi.mocked(getProjects).mockRejectedValueOnce(new Error("db down"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    const { default: HomePage } = await import("@/app/(public)/page");

    render(await HomePage());

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(
      screen.getByText("Projects are temporarily unavailable"),
    ).toBeInTheDocument();
  });
});
