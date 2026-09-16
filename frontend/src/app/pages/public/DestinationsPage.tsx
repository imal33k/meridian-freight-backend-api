import { useMemo, useState, type ReactElement } from 'react';
import { Search, Ship, Plane, Truck } from 'lucide-react';
import { destinations } from '../../data/destinations';
import type { TransportMethod } from '../../types';
import EmptyState from '../../components/shared/EmptyState';

const modeIcons: Record<TransportMethod, ReactElement> = {
  sea: <Ship size={14} />,
  air: <Plane size={14} />,
  land: <Truck size={14} />,
};

export default function DestinationsPage() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<TransportMethod | 'all'>('all');

  const filtered = useMemo(() => {
    return destinations.filter((d) => {
      const matchesQuery =
        !query ||
        d.country.toLowerCase().includes(query.toLowerCase()) ||
        d.region.toLowerCase().includes(query.toLowerCase()) ||
        d.port.toLowerCase().includes(query.toLowerCase());
      const matchesMode = mode === 'all' || d.services.includes(mode);
      return matchesQuery && matchesMode;
    });
  }, [query, mode]);

  return (
    <div>
      <section className="border-b border-line bg-white py-14">
        <div className="container-page">
          <p className="font-mono text-xs uppercase tracking-wider text-cargo">Destinations</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
            Countries and ports we ship to and from.
          </h1>
          <p className="mt-4 max-w-xl text-[15px] text-ink-mid">
            Our destination network is growing as we add carrier partnerships. Search below or contact us if
            you don't see your trade lane listed.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mid" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by country, region or port"
              className="w-full rounded-sm border border-line bg-white py-2.5 pl-10 pr-4 text-[15px] focus:border-ink focus:outline-none"
              aria-label="Search destinations"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'sea', 'air', 'land'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-sm border px-3.5 py-2 text-sm font-medium capitalize transition-colors ${
                  mode === m ? 'border-ink bg-ink text-white' : 'border-line text-ink-mid hover:border-ink/40'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={<Search size={20} />}
              title="No destinations match your search"
              description="Try a different country or port name, or contact us about a new trade lane."
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d) => (
              <div key={d.id} className="flex flex-col gap-3 bg-white p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink">{d.country}</h3>
                    <p className="text-xs text-ink-mid">{d.region}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {d.services.map((s) => (
                      <span key={s} className="flex h-7 w-7 items-center justify-center rounded-sm bg-paper-dim text-ink-mid" title={s}>
                        {modeIcons[s]}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-ink-mid">{d.summary}</p>
                <dl className="mt-1 flex flex-col gap-1 border-t border-line pt-3 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-ink-mid">Primary port</dt>
                    <dd className="text-right font-medium text-ink">{d.port}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-mid">Lead time</dt>
                    <dd className="text-right font-medium text-ink">{d.leadTimeDays}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
