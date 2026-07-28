import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

/** Zero-pads a reference number for the "plaque" motif, e.g. 3 -> "003" */
export function padRef(n: number, width = 3): string {
  return String(n).padStart(width, "0");
}

/** Shortens a UUID down to a legible reference code for plaque tags. */
export function shortRef(id: string): string {
  return id.replace(/-/g, "").slice(0, 6).toUpperCase();
}
