import { describe, expect, it } from "vitest";
import { validateProject } from "@/lib/validation/project";

const validInput = {
  title: "Cool Project",
  description: "A project that does cool things.",
  technologies: ["Next.js"],
  demo_url: "https://example.com/demo",
  source_url: "https://example.com/source",
};

describe("validateProject", () => {
  it("accepts valid input", () => {
    const result = validateProject(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects an empty title", () => {
    const result = validateProject({ ...validInput, title: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.title).toBe("Title is required");
    }
  });

  it("rejects an empty description", () => {
    const result = validateProject({ ...validInput, description: "   " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.description).toBe("Description is required");
    }
  });

  it("rejects a malformed demo_url", () => {
    const result = validateProject({ ...validInput, demo_url: "not-a-url" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.demo_url).toBeDefined();
    }
  });

  it("rejects a malformed source_url", () => {
    const result = validateProject({
      ...validInput,
      source_url: "not-a-url",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.source_url).toBeDefined();
    }
  });

  it("treats empty demo_url/source_url as not provided", () => {
    const result = validateProject({
      ...validInput,
      demo_url: "",
      source_url: "",
    });
    expect(result.success).toBe(true);
  });
});
