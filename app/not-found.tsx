import Link from "next/link";
import { EmptyState } from "@/components/empty-state";

export default function NotFound() {
  return (
    <div className="container-page flex flex-1 flex-col py-16 sm:py-24">
      <EmptyState
        title="Page not found"
        description="This page doesn’t exist or has moved."
      >
        <Link href="/" className="btn btn-primary">
          Back to the projects
        </Link>
      </EmptyState>
    </div>
  );
}
