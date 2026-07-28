import { Button } from "@/components/ui/button";
import { Pagination } from "@/lib/api/properties";

export function PaginationBar({
  pagination,
  onPageChange,
}: {
  pagination?: Pagination | null;
  onPageChange: (page: number) => void;
}) {
  if (!pagination || pagination.totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
      <span className="text-[12px] uppercase tracking-widest2 text-ink-500">
        Page {pagination.page} of {pagination.totalPages} · {pagination.total} listings
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={pagination.page <= 1}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={pagination.page >= pagination.totalPages}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
