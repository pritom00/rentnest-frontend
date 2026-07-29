"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyCardSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useProperties } from "@/hooks/use-properties";

export default function HomePage() {
  const { data, isLoading } = useProperties({ page: 1, limit: 3 });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main id="main-content" className="flex-1">
        <section className="border-b border-ink-900">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-20 sm:px-8 md:grid-cols-[1.2fr_0.8fr] md:py-28">
            <div>
              <p className="plaque mb-6">Est. Registry of Rentals</p>
              <h1 className="font-display text-5xl italic leading-[1.05] text-ink-900 sm:text-6xl">
                Find & list rental
                <br />
                properties with ease.
              </h1>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-700">
                RentNest keeps every listing, request, and lease on one ledger —
                for tenants searching for a place, and landlords managing many.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/properties">
                  <Button variant="primary" size="lg">
                    Browse listings
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="outline" size="lg">
                    List a property
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-end gap-4 border-l border-line pl-8">
              {[
                ["01", "Browse", "Search listings by city, price, and category."],
                ["02", "Request", "Submit a request; the landlord approves or declines."],
                ["03", "Pay & move in", "Pay securely via Stripe once approved."],
              ].map(([num, title, desc]) => (
                <div key={num} className="flex gap-4">
                  <span className="font-mono text-[11px] text-ink-300">{num}</span>
                  <div>
                    <p className="text-[13px] font-medium uppercase tracking-widest2 text-ink-900">{title}</p>
                    <p className="text-[13px] text-ink-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="plaque mb-2">Featured · This Week</p>
              <h2 className="font-display text-3xl italic text-ink-900">Recently listed</h2>
            </div>
            <Link href="/properties" className="hidden items-center gap-1 text-[13px] uppercase tracking-widest2 text-ink-700 hover:text-ink-900 sm:flex">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
            {data?.data.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
