"use client";

import Link from "next/link";
import { CircleSlash2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main id="main-content" className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-5 py-20 text-center sm:px-8">
        <CircleSlash2 className="mb-5 h-10 w-10 text-ink-500" strokeWidth={1.5} />
        <p className="plaque mb-2">Payment Cancelled</p>
        <h1 className="mb-3 font-display text-3xl italic text-ink-900">No charge was made</h1>
        <p className="mb-8 text-[13px] text-ink-500">
          You cancelled the checkout before completing payment. Your rental request is still approved —
          you can try paying again any time from your dashboard.
        </p>
        <Link href="/dashboard/tenant">
          <Button variant="primary">Back to dashboard</Button>
        </Link>
      </main>
      <Footer />
    </div>
  );
}
