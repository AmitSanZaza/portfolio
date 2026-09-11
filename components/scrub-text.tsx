// Splits prose into words so each can light up as it crosses the lower
// third of the viewport (see .scrub-word in globals.css). Paragraph breaks
// are preserved. Server component — no JS shipped.
export function ScrubText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const paragraphs = text.split(/\n\s*\n/);
  return (
    <div className={className}>
      {paragraphs.map((para, pi) => (
        <p key={pi} className={pi > 0 ? "mt-6" : undefined}>
          {para.split(/\s+/).map((word, wi) => (
            <span key={wi} className="scrub-word">
              {word}
              {wi < para.split(/\s+/).length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
