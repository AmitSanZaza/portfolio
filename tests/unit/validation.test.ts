import { describe, expect, it } from "vitest";
import {
  MAX_IMAGE_BYTES,
  validateImage,
  validateProject,
} from "@/lib/validation/project";

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

describe("validateProject URL schemes", () => {
  it.each(["javascript:alert(1)", "data:text/html,hi", "ftp://example.com"])(
    "rejects non-http(s) URL %s",
    (url) => {
      const result = validateProject({ ...validInput, demo_url: url });
      expect(result.success).toBe(false);
    },
  );

  it("accepts http URLs", () => {
    const result = validateProject({
      ...validInput,
      source_url: "http://example.com",
    });
    expect(result.success).toBe(true);
  });
});

describe("validateProject technologies", () => {
  it("removes duplicate tags", () => {
    const result = validateProject({
      ...validInput,
      technologies: ["React", "React", "Next.js"],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.technologies).toEqual(["React", "Next.js"]);
    }
  });
});

describe("validateImage", () => {
  it("accepts a small PNG", () => {
    expect(validateImage({ type: "image/png", size: 1024 })).toBeNull();
  });

  it("rejects non-image types such as SVG or HTML", () => {
    expect(validateImage({ type: "image/svg+xml", size: 1024 })).not.toBeNull();
    expect(validateImage({ type: "text/html", size: 1024 })).not.toBeNull();
  });

  it("rejects files over the size limit", () => {
    expect(
      validateImage({ type: "image/jpeg", size: MAX_IMAGE_BYTES + 1 }),
    ).not.toBeNull();
  });
});
