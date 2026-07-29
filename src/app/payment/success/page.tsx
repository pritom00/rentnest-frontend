"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useConfirmPayment } from "@/hooks/use-payments";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const confirmPayment = useConfirmPayment();
  const [state, setState] = useState<"confirming" | "confirmed" | "error">("confirming");

  useEffect(() => {
    if (!sessionId) {
      setState("error");
      return;
    }
    confirmPayment.mutate(sessionId, {
      onSuccess: () => setState("confirmed"),
      onError: () => setState("error"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <main id="main-content" className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-5 py-20 text-center sm:px-8">
      {state === "confirming" && (
        <>
          <Loader2 className="mb-5 h-8 w-8 animate-spin text-ink-500" />
          <p className="plaque mb-2">Verifying with Stripe</p>
          <h1 className="font-display text-2xl italic text-ink-900">Confirming your payment…</h1>
        </>
      )}

      {state === "confirmed" && (
        <>
          <CheckCircle2 className="mb-5 h-10 w-10 text-ink-900" strokeWidth={1.5} />
          <p className="plaque mb-2">Payment Confirmed</p>
          <h1 className="mb-3 font-display text-3xl italic text-ink-900">You&apos;re all set</h1>
          <p className="mb-8 text-[13px] text-ink-500">
            Your payment went through and your rental is now active. You can find it in your dashboard.
          </p>
          <Link href="/dashboard/tenant">
            <Button variant="primary">Go to dashboard</Button>
          </Link>
        </>
      )}

      {state === "error" && (
        <>
          <XCircle className="mb-5 h-10 w-10 text-stamp" strokeWidth={1.5} />
          <p className="plaque mb-2">Confirmation Failed</p>
          <h1 className="mb-3 font-display text-3xl italic text-ink-900">Couldn&apos;t confirm payment</h1>
          <p className="mb-8 text-[13px] text-ink-500">
            We couldn&apos;t verify this payment automatically. If Stripe charged you, it may still be
            processing — check your dashboard shortly, or contact support with your session reference.
          </p>
          <Link href="/dashboard/tenant">
            <Button variant="outline">Back to dashboard</Button>
          </Link>
        </>
      )}
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Suspense
        fallback={
          <main className="flex flex-1 items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-ink-500" />
          </main>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}
