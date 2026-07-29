export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-50">
      <div className="flex items-center gap-3">
        <div className="h-2 w-2 animate-pulse bg-ink-900" />
        <p className="font-mono text-[12px] uppercase tracking-widest2 text-ink-500">Loading ledger…</p>
      </div>
    </div>
  );
}
