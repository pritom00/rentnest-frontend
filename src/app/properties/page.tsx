"use client";

import { useState } from "react";
import { Home } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyFiltersPanel } from "@/components/property/property-filters";
import { PaginationBar } from "@/components/ui/pagination";
import { PropertyCardSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useProperties } from "@/hooks/use-properties";
import { PropertyFilters, Pagination } from "@/lib/api/properties";

export default function PropertiesPage() {
  const [filters, setFilters] = useState<PropertyFilters>({ page: 1, limit: 9 });
  const { data, isLoading, isError } = useProperties(filters);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:px-8">
        <div className="mb-10">
          <p className="plaque mb-2">Registry · All Listings</p>
          <h1 className="font-display text-4xl italic text-ink-900">Available properties</h1>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">
          <PropertyFiltersPanel value={filters} onChange={setFilters} />

          <div>
            {isLoading && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            )}

            {isError && (
              <EmptyState
                title="Could not load listings"
                description="There was a problem reaching the RentNest API. Please try again shortly."
              />
            )}

            {!isLoading && !isError && data?.data.length === 0 && (
              <EmptyState
                icon={Home}
                title="No listings match your filters"
                description="Try widening your price range or clearing a filter."
              />
            )}

            {!isLoading && !isError && data && data.data.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {data.data.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
                <PaginationBar
                  pagination={data.meta?.pagination as Pagination | undefined}
                  onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
                />
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
