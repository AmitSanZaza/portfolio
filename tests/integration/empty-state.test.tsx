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
