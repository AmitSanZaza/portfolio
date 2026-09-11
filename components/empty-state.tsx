export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="card flex flex-1 flex-col items-center justify-center gap-3 px-6 py-20 text-center">
      <p className="text-[26px] leading-tight text-ink">{title}</p>
      <p className="max-w-sm text-[14px] text-smoke">{description}</p>
    </div>
  );
}
