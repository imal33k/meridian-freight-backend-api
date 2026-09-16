import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Spinner from '../../components/shared/Spinner';
import EmptyState from '../../components/shared/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import * as shipmentsService from '../../services/shipmentsService';
import type { Shipment } from '../../types';
import { shipmentStatusLabels, shipmentStatusTone } from '../../utils/status';
import { formatDate } from '../../utils/format';

export default function PortalShipmentsPage() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[] | null>(null);

  useEffect(() => {
    if (!user) return;
    shipmentsService.listShipmentsForCustomer(user.id).then(setShipments);
  }, [user]);

  return (
    <div className="p-6 lg:p-10">
      <PageHeader title="Shipments" description="All shipments linked to your account, from booking to delivery." />

      {!shipments ? (
        <Spinner label="Loading shipments" />
      ) : shipments.length === 0 ? (
        <EmptyState
          icon={<PackageSearch size={20} />}
          title="No shipments yet"
          description="Shipments appear here once a request has been accepted and booked."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shipments.map((s) => (
            <Link
              key={s.id}
              to={`/portal/shipments/${s.id}`}
              className="flex flex-col gap-3 rounded-sm border border-line bg-white p-5 hover:border-ink/40"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-mono text-xs text-ink-mid">{s.reference}</p>
                <StatusBadge label={shipmentStatusLabels[s.status]} tone={shipmentStatusTone(s.status)} />
              </div>
              <p className="font-display text-lg font-semibold leading-snug text-ink">
                {s.origin} → {s.destination}
              </p>
              <p className="text-sm text-ink-mid">{s.goodsDescription}</p>
              <div className="mt-auto flex items-center justify-between border-t border-line pt-3 text-xs text-ink-mid">
                <span className="capitalize">{s.transportMethod} freight</span>
                <span>Est. {formatDate(s.estimatedDelivery)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
