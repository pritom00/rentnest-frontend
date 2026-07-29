"use client";

import Link from "next/link";
import { FileText, CreditCard } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RentalStatusBadge, PaymentStatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { TableRowSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plaque } from "@/components/ui/plaque";
import { useMyRentals } from "@/hooks/use-rentals";
import { useMyPayments } from "@/hooks/use-payments";
import { useAuthStore } from "@/lib/store/auth-store";
import { formatCurrency, formatDate, shortRef } from "@/lib/utils";

export default function TenantDashboardPage() {
  const { user } = useAuthStore();
  const { data: rentals, isLoading: rentalsLoading } = useMyRentals();
  const { data: payments, isLoading: paymentsLoading } = useMyPayments();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-8">
        <p className="plaque mb-2">Tenant Ledger</p>
        <h1 className="mb-10 font-display text-4xl italic text-ink-900">
          Welcome, {user?.name.split(" ")[0]}
        </h1>

        <section className="mb-14">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[13px] font-medium uppercase tracking-widest2 text-ink-900">
              Rental requests
            </h2>
            <Link href="/properties">
              <Button variant="outline" size="sm">Browse properties</Button>
            </Link>
          </div>

          {rentalsLoading ? (
            <table className="w-full">
              <tbody>
                <TableRowSkeleton cols={5} />
                <TableRowSkeleton cols={5} />
              </tbody>
            </table>
          ) : !rentals || rentals.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No requests yet"
              description="Browse listings and submit a request to a landlord to get started."
              action={
                <Link href="/properties">
                  <Button variant="primary" size="sm">Browse listings</Button>
                </Link>
              }
            />
          ) : (
            <div className="overflow-x-auto border border-line">
              <table className="w-full min-w-[720px] text-left text-[13px]">
                <thead>
                  <tr className="border-b border-ink-900 text-[11px] uppercase tracking-widest2 text-ink-500">
                    <th className="px-4 py-3 font-medium">Property</th>
                    <th className="px-4 py-3 font-medium">Move-in</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Payment</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {rentals.map((r) => (
                    <tr key={r.id} className="border-b border-line last:border-0 hover:bg-paper-100">
                      <td className="px-4 py-4">
                        <Link href={`/properties/${r.propertyId}`} className="hover:underline">
                          {r.property.title}
                        </Link>
                        <Plaque label="Req" value={shortRef(r.id)} className="mt-1 block" />
                      </td>
                      <td className="px-4 py-4 text-ink-700">{formatDate(r.moveInDate)}</td>
                      <td className="px-4 py-4">
                        <RentalStatusBadge status={r.status} />
                      </td>
                      <td className="px-4 py-4">
                        {r.payment ? (
                          <PaymentStatusBadge status={r.payment.status} />
                        ) : (
                          <span className="text-ink-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        {r.status === "APPROVED" && !r.payment && (
                          <Link href={`/dashboard/tenant/requests/${r.id}/pay`}>
                            <Button variant="primary" size="sm">Pay now</Button>
                          </Link>
                        )}
                        {r.status === "COMPLETED" && (
                          <Link href={`/properties/${r.propertyId}`}>
                            <Button variant="outline" size="sm">Leave review</Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-5 text-[13px] font-medium uppercase tracking-widest2 text-ink-900">
            Payment history
          </h2>

          {paymentsLoading ? (
            <table className="w-full">
              <tbody>
                <TableRowSkeleton cols={4} />
              </tbody>
            </table>
          ) : !payments || payments.length === 0 ? (
            <EmptyState icon={CreditCard} title="No payments yet" description="Your paid rentals will appear here." />
          ) : (
            <div className="overflow-x-auto border border-line">
              <table className="w-full min-w-[600px] text-left text-[13px]">
                <thead>
                  <tr className="border-b border-ink-900 text-[11px] uppercase tracking-widest2 text-ink-500">
                    <th className="px-4 py-3 font-medium">Transaction</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-line last:border-0 hover:bg-paper-100">
                      <td className="px-4 py-4 font-mono text-[12px] text-ink-700">{p.transactionId}</td>
                      <td className="px-4 py-4 font-mono">{formatCurrency(p.amount)}</td>
                      <td className="px-4 py-4"><PaymentStatusBadge status={p.status} /></td>
                      <td className="px-4 py-4 text-ink-700">
                        {p.paidAt ? formatDate(p.paidAt) : formatDate(p.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
