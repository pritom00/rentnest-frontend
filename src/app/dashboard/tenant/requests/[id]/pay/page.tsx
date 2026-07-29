"use client";

import { useParams, useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Plaque } from "@/components/ui/plaque";
import { useRental } from "@/hooks/use-rentals";
import { useCreatePaymentSession } from "@/hooks/use-payments";
import { handleApiError } from "@/lib/handle-error";
import { formatCurrency, shortRef } from "@/lib/utils";

export default function PayRentalPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { data: rental, isLoading } = useRental(params.id);
  const createSession = useCreatePaymentSession();

  const handlePay = () => {
    createSession.mutate(params.id, {
      onSuccess: (result) => {
        toast.success("Redirecting to Stripe checkout…");
        // Real Stripe Checkout Session — the browser leaves the app and
        // lands on Stripe's own hosted payment page.
        window.location.href = result.checkoutUrl;
      },
      onError: (err) => handleApiError(err),
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto max-w-xl flex-1 px-5 py-16 sm:px-8">
          <p className="text-ink-500">Loading request…</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto max-w-xl flex-1 px-5 py-16 sm:px-8">
          <p className="text-ink-500">Rental request not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (rental.status !== "APPROVED") {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto max-w-xl flex-1 px-5 py-16 sm:px-8">
          <p className="text-ink-500">
            This request is <span className="font-mono">{rental.status}</span> and isn&apos;t ready for payment.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => router.push("/dashboard/tenant")}>
            Back to dashboard
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-16 sm:px-8">
        <Plaque label="Req" value={shortRef(rental.id)} className="mb-3" />
        <h1 className="mb-8 font-display text-3xl italic text-ink-900">Complete payment</h1>

        <div className="border border-ink-900 p-6">
          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center border border-line">
              <CreditCard className="h-4 w-4 text-ink-700" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-ink-900">{rental.property.title}</p>
              <p className="text-[12px] text-ink-500">
                {rental.property.address}, {rental.property.city}
              </p>
            </div>
          </div>

          <div className="hairline flex items-center justify-between pt-5">
            <span className="text-[12px] uppercase tracking-widest2 text-ink-500">Amount due</span>
            <span className="font-mono text-xl text-ink-900">{formatCurrency(rental.property.price)}</span>
          </div>

          <Button
            variant="primary"
            className="mt-6 w-full"
            onClick={handlePay}
            loading={createSession.isPending}
          >
            Pay with Stripe
          </Button>
          <p className="mt-3 text-center text-[11px] text-ink-300">
            You&apos;ll be redirected to Stripe&apos;s secure checkout to complete this payment.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
