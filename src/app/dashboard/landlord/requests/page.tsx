"use client";

import { toast } from "sonner";
import { ClipboardList } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { RentalStatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { TableRowSkeleton } from "@/components/ui/skeleton";
import { Plaque } from "@/components/ui/plaque";
import { useLandlordRentals, useUpdateRentalStatus, useCompleteRental } from "@/hooks/use-rentals";
import { formatCurrency, formatDate, shortRef } from "@/lib/utils";
import { handleApiError } from "@/lib/handle-error";

export default function LandlordRequestsPage() {
  const { data: requests, isLoading } = useLandlordRentals();
  const updateStatus = useUpdateRentalStatus();
  const completeRental = useCompleteRental();

  const respond = (id: string, status: "APPROVED" | "REJECTED") => {
    updateStatus.mutate(
      { id, status },
      {
        onSuccess: () => toast.success(`Request ${status.toLowerCase()}`),
        onError: (err) => handleApiError(err),
      }
    );
  };

  const complete = (id: string) => {
    completeRental.mutate(id, {
      onSuccess: () => toast.success("Rental marked as completed — tenant can now leave a review"),
      onError: (err) => handleApiError(err),
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-8">
        <p className="plaque mb-2">Requests · Incoming</p>
        <h1 className="mb-10 font-display text-4xl italic text-ink-900">Rental requests</h1>

        {isLoading ? (
          <table className="w-full">
            <tbody>
              <TableRowSkeleton cols={6} />
              <TableRowSkeleton cols={6} />
            </tbody>
          </table>
        ) : !requests || requests.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No requests yet" description="Requests from tenants will appear here." />
        ) : (
          <div className="overflow-x-auto border border-line">
            <table className="w-full min-w-[820px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-ink-900 text-[11px] uppercase tracking-widest2 text-ink-500">
                  <th className="px-4 py-3 font-medium">Property</th>
                  <th className="px-4 py-3 font-medium">Tenant</th>
                  <th className="px-4 py-3 font-medium">Move-in</th>
                  <th className="px-4 py-3 font-medium">Rent</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-b border-line last:border-0 hover:bg-paper-100">
                    <td className="px-4 py-4">
                      {r.property.title}
                      <Plaque label="Req" value={shortRef(r.id)} className="mt-1 block" />
                    </td>
                    <td className="px-4 py-4 text-ink-700">
                      {r.tenant?.name}
                      <span className="block text-[11px] text-ink-500">{r.tenant?.email}</span>
                    </td>
                    <td className="px-4 py-4 text-ink-700">{formatDate(r.moveInDate)}</td>
                    <td className="px-4 py-4 font-mono text-ink-900">{formatCurrency(r.property.price)}</td>
                    <td className="px-4 py-4"><RentalStatusBadge status={r.status} /></td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        {r.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => respond(r.id, "APPROVED")}
                              loading={updateStatus.isPending}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="stamp"
                              onClick={() => respond(r.id, "REJECTED")}
                              loading={updateStatus.isPending}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {r.status === "ACTIVE" && (
                          <Button size="sm" variant="outline" onClick={() => complete(r.id)} loading={completeRental.isPending}>
                            Mark completed
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
