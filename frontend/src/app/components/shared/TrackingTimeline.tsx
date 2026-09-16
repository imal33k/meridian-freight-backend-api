import { Check, Circle, MapPin } from 'lucide-react';
import type { TrackingEvent } from '../../types';
import { formatDateTime } from '../../utils/format';

export default function TrackingTimeline({ events }: { events: TrackingEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="text-[15px] text-ink-mid">
        No tracking events have been recorded yet. Check back once the shipment is picked up.
      </p>
    );
  }

  const ordered = [...events].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  const lastIndex = ordered.length - 1;

  return (
    <ol className="relative">
      {ordered.map((event, i) => {
        const isLast = i === lastIndex;
        return (
          <li key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && <span className="absolute left-[11px] top-6 h-full w-px bg-line" aria-hidden />}
            <span
              className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                isLast ? 'bg-cargo text-white' : 'bg-success/15 text-success'
              }`}
            >
              {isLast ? <Circle size={11} fill="currentColor" /> : <Check size={13} strokeWidth={3} />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="font-medium text-ink">{event.status}</p>
                <p className="font-mono text-xs text-ink-mid">{formatDateTime(event.timestamp)}</p>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-mid">
                <MapPin size={13} className="shrink-0" />
                {event.location}
              </p>
              {event.description && <p className="mt-1.5 text-[15px] text-ink-mid">{event.description}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
