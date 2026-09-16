import type { ReactNode } from 'react';

export default function StatCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string | number;
  icon?: ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-sm border border-line bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink-mid">{label}</p>
        {icon && <span className="text-ink-mid/60">{icon}</span>}
      </div>
      <p className="mt-2 font-display text-3xl font-semibold text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-mid">{hint}</p>}
    </div>
  );
}
