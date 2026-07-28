import { cn } from "@/lib/utils";
import { RentalStatus, PropertyStatus, UserStatus, PaymentStatus } from "@/lib/api/types";

// Monochrome status system: the ledger stays black & white, with the
// single "stamp red" reserved for rejection/failure/danger states —
// like a rubber ink-stamp on a paper form. Everything else is
// distinguished by weight and fill, not color.
const RENTAL_STYLES: Record<RentalStatus, string> = {
  PENDING: "border border-ink-300 text-ink-500",
  APPROVED: "border border-ink-900 text-ink-900",
  ACTIVE: "bg-ink-900 text-paper-50",
  COMPLETED: "border border-line text-ink-300",
  REJECTED: "border border-stamp text-stamp",
  CANCELLED: "border border-stamp text-stamp",
};

const PROPERTY_STYLES: Record<PropertyStatus, string> = {
  AVAILABLE: "border border-ink-900 text-ink-900",
  RENTED: "bg-ink-900 text-paper-50",
  UNAVAILABLE: "border border-line text-ink-300",
};

const USER_STYLES: Record<UserStatus, string> = {
  ACTIVE: "border border-ink-900 text-ink-900",
  BANNED: "border border-stamp text-stamp",
};

const PAYMENT_STYLES: Record<PaymentStatus, string> = {
  PENDING: "border border-ink-300 text-ink-500",
  COMPLETED: "bg-ink-900 text-paper-50",
  FAILED: "border border-stamp text-stamp",
  REFUNDED: "border border-line text-ink-300",
};

function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 text-[10px] font-mono uppercase tracking-widest2",
        className
      )}
    >
      {children}
    </span>
  );
}

export function RentalStatusBadge({ status }: { status: RentalStatus }) {
  return <Badge className={RENTAL_STYLES[status]}>{status}</Badge>;
}

export function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  return <Badge className={PROPERTY_STYLES[status]}>{status}</Badge>;
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return <Badge className={USER_STYLES[status]}>{status}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge className={PAYMENT_STYLES[status]}>{status}</Badge>;
}
