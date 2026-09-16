import type { StatusTone } from '../../utils/status';

const toneClasses: Record<StatusTone, string> = {
  neutral: 'bg-ink/5 text-ink-mid border-ink/10',
  progress: 'bg-sea/10 text-sea-dark border-sea/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/25',
  danger: 'bg-danger/10 text-danger border-danger/20',
};

const dotClasses: Record<StatusTone, string> = {
  neutral: 'bg-ink-mid',
  progress: 'bg-sea',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

export default function StatusBadge({ label, tone = 'neutral' }: { label: string; tone?: StatusTone }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotClasses[tone]}`} />
      {label}
    </span>
  );
}
