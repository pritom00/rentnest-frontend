import { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-line px-6 py-16 text-center">
      {Icon && <Icon className="mb-4 h-6 w-6 text-ink-300" strokeWidth={1.5} />}
      <p className="font-display text-lg italic text-ink-900">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-[13px] text-ink-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
