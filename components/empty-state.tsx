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
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-24 text-center">
      <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
        {title}
      </p>
      <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
