"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = project.image_url && !imageFailed;
  const primaryUrl = project.demo_url || project.source_url;

  return (
    <article
      className={`card card-lift relative flex h-full flex-col overflow-hidden p-3 ${
        primaryUrl ? "hover:border-ink" : ""
      }`}
    >
      {primaryUrl && (
        <a
          href={primaryUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.title}`}
          className="absolute inset-0 z-0"
        />
      )}

      <div className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-frame bg-surface-2">
        {showImage ? (
          // A plain <img> avoids requiring the owner to allowlist their
          // Supabase Storage domain in next.config.ts for Next/Image.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image_url!}
            alt={`${project.title} screenshot`}
            width={1600}
            height={1000}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="eyebrow">No image</span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-3 pb-3 pt-5">
        <h3 className="text-[26px] leading-[1.2]">{project.title}</h3>
        <p className="break-words text-[14px] leading-relaxed text-graphite">
          {project.description}
        </p>

        {project.technologies.length > 0 && (
          <ul className="flex flex-wrap gap-2 pt-1">
            {project.technologies.map((tech) => (
              <li key={tech} className="tag">
                {tech}
              </li>
            ))}
          </ul>
        )}

        {(project.demo_url || project.source_url) && (
          <div className="relative z-10 mt-auto flex gap-5 pt-3 text-[13px]">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="link text-ink"
              >
                Live demo
              </a>
            )}
            {project.source_url && (
              <a
                href={project.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="link text-ink"
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
