"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Fades and lifts its children into place the first time they scroll into
// view. Pure CSS transition (see [data-reveal] in globals.css); this only
// toggles the class. Renders visible when IntersectionObserver is missing.
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // In view, or already scrolled past (back-navigation restores the
          // scroll position; anchor jumps skip the middle) — either way, show.
          if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
            el.classList.add("is-in");
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      // @ts-expect-error — the ref is typed loosely so `as` can vary.
      ref={ref}
      data-reveal=""
      className={className}
      style={
        delay
          ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </Tag>
  );
}
