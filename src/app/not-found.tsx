import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper-50 px-5 text-center">
      <div className="mb-6 border border-ink-900 px-6 py-4">
        <p className="font-mono text-[11px] uppercase tracking-widest2 text-ink-500">Plaque</p>
        <p className="font-display text-4xl italic text-ink-900">No. 404</p>
      </div>
      <h1 className="mb-3 font-display text-2xl italic text-ink-900">This page isn&apos;t on the ledger</h1>
      <p className="mb-8 max-w-sm text-[13px] text-ink-500">
        The page you&apos;re looking for doesn&apos;t exist, or may have moved.
      </p>
      <Link href="/">
        <Button variant="primary">Back to home</Button>
      </Link>
    </div>
  );
}
