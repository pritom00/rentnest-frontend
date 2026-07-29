import { cn } from "@/lib/utils";
import { RentalStatus, PropertyStatus, UserStatus, PaymentStatus } from "@/lib/api/types";

// Rental status uses the spec's suggested color coding — this is the
// one place color is used functionally, since status at a glance
// (pending/approved/rejected/active/completed) is the single most
// important signal a tenant or landlord reads on this page.
const RENTAL_STYLES: Record<RentalStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 border border-amber-300",
  APPROVED: "bg-blue-100 text-blue-800 border border-blue-300",
  ACTIVE: "bg-emerald-100 text-emerald-800 border border-emerald-300",
  COMPLETED: "bg-gray-100 text-gray-600 border border-gray-300",
  REJECTED: "bg-red-100 text-red-700 border border-red-300",
  CANCELLED: "bg-red-100 text-red-700 border border-red-300",
};

// Everywhere else keeps the black & white "ledger" system, with the
// single "stamp red" accent reserved for errors/danger states.

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
