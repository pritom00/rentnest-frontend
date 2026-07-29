"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PaymentStatusBadge } from "@/components/ui/badge";
import { Plaque } from "@/components/ui/plaque";
import { usePayment } from "@/hooks/use-payments";
import { formatCurrency, formatDate, shortRef } from "@/lib/utils";

export default function PaymentDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: payment, isLoading } = usePayment(params.id);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main id="main-content" className="mx-auto w-full max-w-xl flex-1 px-5 py-12 sm:px-8">
        <p className="plaque mb-2">Payment Record</p>
        <h1 className="mb-8 font-display text-3xl italic text-ink-900">Payment details</h1>

        {isLoading ? (
          <p className="text-ink-500">Loading…</p>
        ) : !payment ? (
          <p className="text-ink-500">Payment not found.</p>
        ) : (
          <div className="border border-ink-900 p-6">
            <div className="mb-5 flex items-start justify-between">
              <Plaque label="Txn" value={shortRef(payment.id)} />
              <PaymentStatusBadge status={payment.status} />
            </div>

            <dl className="space-y-4 text-[13px]">
              <div className="flex justify-between border-b border-line pb-3">
                <dt className="text-ink-500">Transaction ID</dt>
                <dd className="font-mono text-ink-900">{payment.transactionId}</dd>
              </div>
              <div className="flex justify-between border-b border-line pb-3">
                <dt className="text-ink-500">Amount</dt>
                <dd className="font-mono text-ink-900">{formatCurrency(payment.amount)}</dd>
              </div>
              <div className="flex justify-between border-b border-line pb-3">
                <dt className="text-ink-500">Provider</dt>
                <dd className="text-ink-900">{payment.provider}</dd>
              </div>
              <div className="flex justify-between border-b border-line pb-3">
                <dt className="text-ink-500">Paid at</dt>
                <dd className="text-ink-900">{payment.paidAt ? formatDate(payment.paidAt) : "—"}</dd>
              </div>
              {payment.rentalRequest?.property && (
                <div className="flex justify-between pb-1">
                  <dt className="text-ink-500">Property</dt>
                  <dd>
                    <Link href={`/properties/${payment.rentalRequest.property.id}`} className="text-ink-900 underline">
                      {payment.rentalRequest.property.title}
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
