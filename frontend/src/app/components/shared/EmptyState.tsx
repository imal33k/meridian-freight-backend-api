import type { ReactNode } from 'react';

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-line bg-white px-6 py-14 text-center">
      {icon && <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-paper-dim text-ink-mid">{icon}</div>}
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-[15px] text-ink-mid">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
