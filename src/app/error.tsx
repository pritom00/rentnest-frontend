"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Unhandled route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper-50 px-5 text-center">
      <AlertTriangle className="mb-5 h-10 w-10 text-stamp" strokeWidth={1.5} />
      <p className="plaque mb-2">System Notice</p>
      <h1 className="mb-3 font-display text-3xl italic text-ink-900">Something went wrong</h1>
      <p className="mb-8 max-w-sm text-[13px] text-ink-500">
        An unexpected error interrupted this page. You can try again, or head back to safer ground.
      </p>
      <div className="flex gap-3">
        <Button variant="primary" onClick={() => reset()}>Try again</Button>
        <Link href="/">
          <Button variant="outline">Back to home</Button>
        </Link>
      </div>
    </div>
  );
}
