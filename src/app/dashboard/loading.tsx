import { TableRowSkeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <div className="mb-10 h-8 w-72 animate-pulse bg-paper-200" />
      <table className="w-full border border-line">
        <tbody>
          <TableRowSkeleton cols={5} />
          <TableRowSkeleton cols={5} />
          <TableRowSkeleton cols={5} />
        </tbody>
      </table>
    </div>
  );
}
