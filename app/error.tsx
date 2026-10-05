"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { EmptyState } from "@/components/empty-state";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <EmptyState
      title="Something went wrong"
      description="This page couldn't be loaded. Please try again in a moment."
    >
      <button
        type="button"
        onClick={() => retry()}
        className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
      >
        Try again
      </button>
    </EmptyState>
  );
}
