import { cn } from "@/lib/utils";

/**
 * The signature device of the RentNest UI: every property, rental
 * request, and payment carries a small brass-plaque-style reference
 * tag, echoing building directories and door plaques. Used consistently
 * across cards, tables, detail pages, and even the 404 page.
 */
export function Plaque({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <span className={cn("plaque", className)}>
      <span className="h-[3px] w-[3px] bg-ink-500" />
      {label} No. {value}
    </span>
  );
}
