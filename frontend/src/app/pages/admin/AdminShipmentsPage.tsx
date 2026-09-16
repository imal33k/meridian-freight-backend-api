import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Spinner from '../../components/shared/Spinner';
import EmptyState from '../../components/shared/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import * as shipmentsService from '../../services/shipmentsService';
import type { Shipment, ShipmentStatus } from '../../types';
import { shipmentStatusLabels, shipmentStatusTone } from '../../utils/status';
import { formatDate } from '../../utils/format';

const filterOptions: { value: ShipmentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'booked', label: 'Booked' },
  { value: 'in_transit', label: 'In transit' },
  { value: 'customs', label: 'Customs' },
  { value: 'out_for_delivery', label: 'Out for delivery' },
  { value: 'delivered', label: 'Delivered' },
];

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[] | null>(null);
  const [filter, setFilter] = useState<ShipmentStatus | 'all'>('all');

  useEffect(() => {
    shipmentsService.listAllShipments().then(setShipments);
  }, []);

  const filtered = useMemo(() => {
    if (!shipments) return [];
    return filter === 'all' ? shipments : shipments.filter((s) => s.status === filter);
  }, [shipments, filter]);

  return (
    <div className="p-6 lg:p-10">
      <PageHeader title="Shipments" description="Manage shipment status, tracking events and documents." />

      <div className="mb-6 flex flex-wrap gap-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`rounded-sm border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === opt.value ? 'border-ink bg-ink text-white' : 'border-line text-ink-mid hover:border-ink/40'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {!shipments ? (
        <Spinner label="Loading shipments" />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<PackageSearch size={20} />} title="No shipments found" description="No shipments match this filter." />
      ) : (
        <div className="overflow-hidden rounded-sm border border-line bg-white">
          <table className="hidden w-full text-left sm:table">
            <thead className="border-b border-line bg-paper-dim/60 text-xs uppercase tracking-wide text-ink-mid">
              <tr>
                <th className="px-5 py-3 font-medium">Reference</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Route</th>
                <th className="px-5 py-3 font-medium">Est. delivery</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-paper-dim/40">
                  <td className="px-5 py-4"><Link to={`/admin/shipments/${s.id}`} className="font-mono text-sm text-ink hover:text-cargo">{s.reference}</Link></td>
                  <td className="px-5 py-4 text-[15px] text-ink">{s.customerName}</td>
                  <td className="px-5 py-4 text-[15px] text-ink-mid">{s.origin} → {s.destination}</td>
                  <td className="px-5 py-4 text-sm text-ink-mid">{formatDate(s.estimatedDelivery)}</td>
                  <td className="px-5 py-4"><StatusBadge label={shipmentStatusLabels[s.status]} tone={shipmentStatusTone(s.status)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="divide-y divide-line sm:hidden">
            {filtered.map((s) => (
              <li key={s.id}>
                <Link to={`/admin/shipments/${s.id}`} className="flex flex-col gap-2 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-ink-mid">{s.reference}</span>
                    <StatusBadge label={shipmentStatusLabels[s.status]} tone={shipmentStatusTone(s.status)} />
                  </div>
                  <p className="text-[15px] font-medium text-ink">{s.customerName}</p>
                  <p className="text-xs text-ink-mid">{s.origin} → {s.destination}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
