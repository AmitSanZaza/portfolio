import Link from "next/link";
import { EmptyState } from "@/components/empty-state";

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      description="The page you're looking for doesn't exist or has moved."
    >
      <Link
        href="/"
        className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
      >
        Back to projects
      </Link>
    </EmptyState>
  );
}
