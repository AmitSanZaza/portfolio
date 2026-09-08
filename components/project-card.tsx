"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = project.image_url && !imageFailed;

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
      <div className="flex h-40 items-center justify-center bg-zinc-100 dark:bg-zinc-900">
        {showImage ? (
          // A plain <img> avoids requiring the owner to allowlist their
          // Supabase Storage domain in next.config.ts for Next/Image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image_url!}
            alt={`${project.title} screenshot`}
            className="h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="text-sm text-zinc-400 dark:text-zinc-600">
            No image
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-lg font-semibold">{project.title}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {project.description}
        </p>

        {project.technologies.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <li
                key={tech}
                className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        {(project.demo_url || project.source_url) && (
          <div className="mt-auto flex gap-4 pt-2 text-sm font-medium">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Live demo
              </a>
            )}
            {project.source_url && (
              <a
                href={project.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Source code
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
