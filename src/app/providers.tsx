"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0A0A0A",
            color: "#FAFAF7",
            borderRadius: 0,
            border: "1px solid #0A0A0A",
            fontFamily: "var(--font-inter)",
            fontSize: "13px",
          },
        }}
      />
    </QueryClientProvider>
  );
}
