import Link from "next/link";
import Image from "next/image";
import { BedDouble, Bath, Ruler } from "lucide-react";
import { Property } from "@/lib/api/types";
import { formatCurrency, shortRef } from "@/lib/utils";
import { Plaque } from "@/components/ui/plaque";

export function PropertyCard({ property }: { property: Property }) {
  const image = property.images?.[0];

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block border border-line bg-paper-50 transition-colors hover:border-ink-900"
    >
      <div className="relative h-40 w-full overflow-hidden border-b border-line">
        {image ? (
          <Image src={image} alt={property.title} fill className="object-cover" />
        ) : (
          <div className="hatch-pattern flex h-full w-full items-center justify-center bg-paper-100">
            <span className="plaque bg-paper-50 px-2 py-1">No photo on file</span>
          </div>
        )}
        <div className="absolute left-0 top-0 bg-ink-900 px-2 py-1">
          <span className="font-mono text-[10px] uppercase tracking-widest2 text-paper-50">
            {property.status}
          </span>
        </div>
      </div>

      <div className="p-5">
        <Plaque label="Unit" value={shortRef(property.id)} />
        <h3 className="mt-2 font-display text-lg leading-snug text-ink-900 group-hover:underline">
          {property.title}
        </h3>
        <p className="mt-1 text-[13px] text-ink-500">
          {property.address}, {property.city}
        </p>

        <div className="mt-4 flex items-center gap-4 text-ink-500">
          <span className="flex items-center gap-1 text-[12px]">
            <BedDouble className="h-3.5 w-3.5" /> {property.bedrooms}
          </span>
          <span className="flex items-center gap-1 text-[12px]">
            <Bath className="h-3.5 w-3.5" /> {property.bathrooms}
          </span>
          {property.areaSqft && (
            <span className="flex items-center gap-1 text-[12px]">
              <Ruler className="h-3.5 w-3.5" /> {property.areaSqft} sqft
            </span>
          )}
        </div>

        <div className="hairline mt-4 flex items-center justify-between pt-4">
          <span className="font-mono text-base text-ink-900">{formatCurrency(property.price)}</span>
          <span className="text-[11px] uppercase tracking-widest2 text-ink-500">/ month</span>
        </div>
      </div>
    </Link>
  );
}
