import { Loader2 } from 'lucide-react';

export default function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5 py-16 text-ink-mid">
      <Loader2 size={18} className="animate-spin" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}
