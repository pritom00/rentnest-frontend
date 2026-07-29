"use client";

// Catches errors thrown from the root layout itself (rare, but required
// by Next.js to guarantee there's always a fallback UI). Must render its
// own <html>/<body> since it replaces the root layout entirely.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", background: "#FAFAF7", color: "#0A0A0A" }}>
          <h1 style={{ fontSize: "24px", marginBottom: "12px" }}>Something went critically wrong</h1>
          <button
            onClick={() => reset()}
            style={{ padding: "10px 20px", background: "#0A0A0A", color: "#FAFAF7", border: "none", cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
