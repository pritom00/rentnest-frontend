"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const dashboardPath: Record<string, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
};

export function Navbar() {
  const { user, clearSession, hydrated } = useAuthStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    clearSession();
    toast.success("Signed out");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink-900 bg-paper-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="font-display text-xl italic tracking-tight text-ink-900">
          RentNest
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/properties" className="text-[13px] uppercase tracking-widest2 text-ink-700 hover:text-ink-900">
            Properties
          </Link>

          {hydrated && user ? (
            <>
              <Link
                href={dashboardPath[user.role]}
                className="text-[13px] uppercase tracking-widest2 text-ink-700 hover:text-ink-900"
              >
                Dashboard
              </Link>
              <span className="plaque">{user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-[13px] uppercase tracking-widest2 text-ink-700 hover:text-ink-900">
                Sign in
              </Link>
              <Button variant="primary" size="sm" onClick={() => router.push("/auth/register")}>
                Get started
              </Button>
            </>
          )}
        </nav>

        <button
          className="md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className={cn("border-t border-line md:hidden", open ? "block" : "hidden")}>
        <div className="flex flex-col gap-1 px-5 py-4">
          <Link href="/properties" className="py-2 text-[13px] uppercase tracking-widest2" onClick={() => setOpen(false)}>
            Properties
          </Link>
          {hydrated && user ? (
            <>
              <Link
                href={dashboardPath[user.role]}
                className="py-2 text-[13px] uppercase tracking-widest2"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="py-2 text-left text-[13px] uppercase tracking-widest2 text-stamp">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="py-2 text-[13px] uppercase tracking-widest2" onClick={() => setOpen(false)}>
                Sign in
              </Link>
              <Link href="/auth/register" className="py-2 text-[13px] uppercase tracking-widest2" onClick={() => setOpen(false)}>
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
