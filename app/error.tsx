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
    <div className="container-page flex flex-1 flex-col py-16 sm:py-24">
      <EmptyState
        title="Something went wrong"
        description="This page couldn’t be loaded. Try again in a moment."
      >
        <button type="button" onClick={() => retry()} className="btn btn-dark">
          Try again
        </button>
      </EmptyState>
    </div>
  );
}
