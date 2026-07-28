import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-ink-900 bg-paper-50">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="font-display text-lg italic text-ink-900">RentNest</p>
            <p className="mt-1 max-w-sm text-[13px] text-ink-500">
              Find & list rental properties with ease. A ledger of listings, requests, and leases in one place.
            </p>
          </div>
          <div className="flex gap-6 text-[12px] uppercase tracking-widest2 text-ink-500">
            <Link href="/properties" className="hover:text-ink-900">Properties</Link>
            <Link href="/auth/register" className="hover:text-ink-900">Register</Link>
            <Link href="/auth/login" className="hover:text-ink-900">Sign in</Link>
          </div>
        </div>
        <div className="hairline mt-8 pt-5 text-[11px] text-ink-300">
          © {new Date().getFullYear()} RentNest. Built for demonstration purposes.
        </div>
      </div>
    </footer>
  );
}
