export function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="card flex flex-1 flex-col items-center justify-center gap-3 px-6 py-20 text-center">
      <p className="text-[26px] leading-tight text-ink">{title}</p>
      <p className="max-w-sm text-[14px] text-smoke">{description}</p>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
