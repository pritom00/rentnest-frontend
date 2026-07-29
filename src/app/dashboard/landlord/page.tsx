"use client";

import Link from "next/link";
import { Building2, Plus, ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { PropertyStatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PropertyCardSkeleton } from "@/components/ui/skeleton";
import { Plaque } from "@/components/ui/plaque";
import { useMyProperties, useDeleteProperty } from "@/hooks/use-properties";
import { useAuthStore } from "@/lib/store/auth-store";
import { formatCurrency, shortRef } from "@/lib/utils";
import { handleApiError } from "@/lib/handle-error";

export default function LandlordDashboardPage() {
  const { user } = useAuthStore();
  const { data: properties, isLoading } = useMyProperties();
  const deleteProperty = useDeleteProperty();

  const stats = {
    total: properties?.length ?? 0,
    available: properties?.filter((p) => p.status === "AVAILABLE").length ?? 0,
    rented: properties?.filter((p) => p.status === "RENTED").length ?? 0,
    requests: properties?.reduce((sum, p) => sum + (p._count?.rentalRequests ?? 0), 0) ?? 0,
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Remove "${title}" from your listings? This cannot be undone.`)) return;
    deleteProperty.mutate(id, {
      onSuccess: () => toast.success("Listing removed"),
      onError: (err) => handleApiError(err),
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="plaque mb-2">Landlord Ledger</p>
            <h1 className="font-display text-4xl italic text-ink-900">
              Welcome, {user?.name.split(" ")[0]}
            </h1>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/landlord/requests">
              <Button variant="outline">
                <ClipboardList className="h-3.5 w-3.5" /> Requests
              </Button>
            </Link>
            <Link href="/dashboard/landlord/properties/new">
              <Button variant="primary">
                <Plus className="h-3.5 w-3.5" /> New listing
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-12 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
          {[
            ["Total listings", stats.total],
            ["Available", stats.available],
            ["Rented", stats.rented],
            ["Total requests", stats.requests],
          ].map(([label, value]) => (
            <div key={label as string} className="bg-paper-50 p-5">
              <p className="text-[11px] uppercase tracking-widest2 text-ink-500">{label}</p>
              <p className="mt-1 font-mono text-2xl text-ink-900">{value}</p>
            </div>
          ))}
        </div>

        <h2 className="mb-5 text-[13px] font-medium uppercase tracking-widest2 text-ink-900">
          Your listings
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : !properties || properties.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No listings yet"
            description="Create your first property listing to start receiving rental requests."
            action={
              <Link href="/dashboard/landlord/properties/new">
                <Button variant="primary" size="sm">Create a listing</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <div key={p.id} className="border border-line p-5">
                <div className="mb-2 flex items-start justify-between">
                  <Plaque label="Unit" value={shortRef(p.id)} />
                  <PropertyStatusBadge status={p.status} />
                </div>
                <h3 className="font-display text-lg text-ink-900">{p.title}</h3>
                <p className="mt-1 text-[12px] text-ink-500">{p.city}</p>
                <p className="mt-3 font-mono text-base text-ink-900">{formatCurrency(p.price)}</p>
                <p className="mt-1 text-[11px] text-ink-500">
                  {p._count?.rentalRequests ?? 0} request{p._count?.rentalRequests === 1 ? "" : "s"} · {p._count?.reviews ?? 0} review{p._count?.reviews === 1 ? "" : "s"}
                </p>
                <div className="hairline mt-4 flex gap-2 pt-4">
                  <Link href={`/dashboard/landlord/properties/${p.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">Edit</Button>
                  </Link>
                  <Button
                    variant="stamp"
                    size="sm"
                    onClick={() => handleDelete(p.id, p.title)}
                    loading={deleteProperty.isPending}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
