import { Check } from 'lucide-react';
import type { ShipmentStatus } from '../../types';
import { shipmentPipeline, shipmentStatusLabels } from '../../utils/status';

export default function ShipmentPipelineStepper({ status }: { status: ShipmentStatus }) {
  if (status === 'on_hold') {
    return (
      <div className="rounded-sm border border-warning/30 bg-warning/5 px-4 py-3 text-sm font-medium text-warning">
        This shipment is currently on hold.
      </div>
    );
  }

  const currentIndex = shipmentPipeline.indexOf(status);

  return (
    <ol className="flex flex-wrap items-center gap-x-1 gap-y-4 sm:flex-nowrap">
      {shipmentPipeline.map((step, i) => {
        const isDone = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <li key={step} className="flex flex-1 min-w-[110px] flex-col items-start gap-2 sm:min-w-0">
            <div className="flex w-full items-center gap-1.5">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isDone
                    ? 'bg-success text-white'
                    : isCurrent
                      ? 'bg-cargo text-white'
                      : 'bg-paper-dim text-ink-mid'
                }`}
              >
                {isDone ? <Check size={13} strokeWidth={3} /> : i + 1}
              </span>
              {i < shipmentPipeline.length - 1 && (
                <span className={`h-px flex-1 ${isDone ? 'bg-success' : 'bg-line'}`} />
              )}
            </div>
            <p className={`text-xs font-medium leading-tight ${isCurrent ? 'text-ink' : 'text-ink-mid'}`}>
              {shipmentStatusLabels[step]}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
