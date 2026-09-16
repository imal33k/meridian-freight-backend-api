import { useState, type FormEvent } from 'react';
import { Search, PackageX, Ship, Plane, Truck, MapPin, CalendarClock } from 'lucide-react';
import * as shipmentsService from '../../services/shipmentsService';
import type { Shipment } from '../../types';
import TrackingTimeline from '../../components/shared/TrackingTimeline';
import StatusBadge from '../../components/ui/StatusBadge';
import { shipmentStatusLabels, shipmentStatusTone } from '../../utils/status';
import { formatDate } from '../../utils/format';
import Spinner from '../../components/shared/Spinner';

const modeIcon = { sea: <Ship size={15} />, air: <Plane size={15} />, land: <Truck size={15} /> };

export default function TrackPage() {
  const [reference, setReference] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'not_found'>('idle');
  const [result, setResult] = useState<Shipment | null>(null);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!reference.trim()) return;
    setStatus('loading');
    const shipment = await shipmentsService.trackByReference(reference);
    if (shipment) {
      setResult(shipment);
      setStatus('found');
    } else {
      setResult(null);
      setStatus('not_found');
    }
  }

  return (
    <div>
      <section className="border-b border-line bg-ink py-16 text-white lg:py-20">
        <div className="container-page">
          <p className="font-mono text-xs uppercase tracking-wider text-cargo">Public tracking</p>
          <h1 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
            Track your shipment
          </h1>
          <p className="mt-3 max-w-md text-[15px] text-white/65">
            Enter your tracking reference to see shipment status, origin, destination and estimated delivery.
          </p>
          <form onSubmit={handleSearch} className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mid" />
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. EXP-2026-001293"
                aria-label="Tracking number"
                className="w-full rounded-sm border border-transparent bg-white py-3.5 pl-11 pr-4 font-mono text-[15px] text-ink placeholder:text-ink-mid/50 focus:outline-none focus:ring-2 focus:ring-cargo"
              />
            </div>
            <button
              type="submit"
              className="rounded-sm bg-cargo px-6 py-3.5 text-sm font-medium text-white hover:bg-cargo-dark"
            >
              Track shipment
            </button>
          </form>
          <p className="mt-3 text-xs text-white/40">Try EXP-2026-001293 or IMP-2026-000871 for a demo.</p>
        </div>
      </section>

      <section className="container-page py-14">
        {status === 'idle' && (
          <p className="text-center text-[15px] text-ink-mid">Enter a tracking number above to see shipment details.</p>
        )}

        {status === 'loading' && <Spinner label="Looking up shipment" />}

        {status === 'not_found' && (
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-sm border border-dashed border-line bg-white px-6 py-14 text-center">
            <PackageX size={28} className="text-ink-mid" />
            <h2 className="font-display text-xl font-semibold text-ink">No shipment found</h2>
            <p className="text-[15px] text-ink-mid">
              We couldn't find a shipment matching "{reference}". Double-check the reference number, or
              contact us if you believe this is an error.
            </p>
          </div>
        )}

        {status === 'found' && result && (
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
              <div>
                <p className="font-mono text-sm text-ink-mid">{result.reference}</p>
                <h2 className="mt-1 font-display text-2xl font-semibold text-ink">
                  {result.origin} → {result.destination}
                </h2>
              </div>
              <StatusBadge label={shipmentStatusLabels[result.status]} tone={shipmentStatusTone(result.status)} />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-sm border border-line bg-white p-4">
                <p className="flex items-center gap-1.5 text-xs text-ink-mid">
                  {modeIcon[result.transportMethod]} Transport method
                </p>
                <p className="mt-1.5 text-sm font-medium capitalize text-ink">{result.transportMethod} freight</p>
              </div>
              <div className="rounded-sm border border-line bg-white p-4">
                <p className="flex items-center gap-1.5 text-xs text-ink-mid">
                  <MapPin size={14} /> Current status
                </p>
                <p className="mt-1.5 text-sm font-medium text-ink">{result.currentLocation}</p>
              </div>
              <div className="rounded-sm border border-line bg-white p-4">
                <p className="flex items-center gap-1.5 text-xs text-ink-mid">
                  <CalendarClock size={14} /> Estimated delivery
                </p>
                <p className="mt-1.5 text-sm font-medium text-ink">{formatDate(result.estimatedDelivery)}</p>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="font-display text-xl font-semibold text-ink">Shipment activity</h3>
              <div className="mt-5 rounded-sm border border-line bg-white p-6">
                <TrackingTimeline events={result.events} />
              </div>
            </div>

            <p className="mt-6 text-xs text-ink-mid">
              For document access and full shipment history, log in to the customer portal.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
