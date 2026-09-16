import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2, ArrowRight, Plus } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import StatCard from '../../components/shared/StatCard';
import Spinner from '../../components/shared/Spinner';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import * as shipmentsService from '../../services/shipmentsService';
import * as requestsService from '../../services/requestsService';
import * as notificationsService from '../../services/notificationsService';
import type { Shipment, ExportRequest, AppNotification } from '../../types';
import { shipmentStatusLabels, shipmentStatusTone } from '../../utils/status';
import { formatDate, timeAgo } from '../../utils/format';

export default function PortalOverviewPage() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[] | null>(null);
  const [requests, setRequests] = useState<ExportRequest[] | null>(null);
  const [activity, setActivity] = useState<AppNotification[] | null>(null);

  useEffect(() => {
    if (!user) return;
    shipmentsService.listShipmentsForCustomer(user.id).then(setShipments);
    requestsService.listRequestsForCustomer(user.id).then(setRequests);
    notificationsService.listNotifications(user.id).then(setActivity);
  }, [user]);

  if (!shipments || !requests || !activity) {
    return (
      <div className="p-6 lg:p-10">
        <Spinner label="Loading your dashboard" />
      </div>
    );
  }

  const activeShipments = shipments.filter((s) => s.status !== 'delivered');
  const pendingRequests = requests.filter((r) => ['pending', 'under_review', 'quote_provided'].includes(r.status));
  const delivered = shipments.filter((s) => s.status === 'delivered');
  const recentShipments = [...shipments].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4);

  return (
    <div className="p-6 lg:p-10">
      <PageHeader
        title={`Welcome back, ${user?.firstName}`}
        description="Here's what's happening with your shipments and requests."
        actions={
          <Button as="link" to="/portal/requests/new" icon={<Plus size={16} />} iconPosition="left">
            New request
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active shipments" value={activeShipments.length} icon={<Package size={18} />} />
        <StatCard label="Pending requests" value={pendingRequests.length} icon={<Clock size={18} />} />
        <StatCard label="Delivered shipments" value={delivered.length} icon={<CheckCircle2 size={18} />} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ink">Recent shipments</h2>
            <Link to="/portal/shipments" className="flex items-center gap-1 text-sm font-medium text-cargo hover:text-cargo-dark">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-sm border border-line bg-white">
            {recentShipments.length === 0 ? (
              <p className="p-6 text-center text-[15px] text-ink-mid">No shipments yet.</p>
            ) : (
              <ul className="divide-y divide-line">
                {recentShipments.map((s) => (
                  <li key={s.id}>
                    <Link to={`/portal/shipments/${s.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-paper-dim">
                      <div className="min-w-0">
                        <p className="font-mono text-xs text-ink-mid">{s.reference}</p>
                        <p className="mt-0.5 truncate text-[15px] font-medium text-ink">
                          {s.origin} → {s.destination}
                        </p>
                        <p className="mt-0.5 text-xs text-ink-mid">Est. delivery {formatDate(s.estimatedDelivery)}</p>
                      </div>
                      <StatusBadge label={shipmentStatusLabels[s.status]} tone={shipmentStatusTone(s.status)} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Recent activity</h2>
          <div className="mt-4 rounded-sm border border-line bg-white p-5">
            {activity.length === 0 ? (
              <p className="text-[15px] text-ink-mid">No recent activity.</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {activity.slice(0, 5).map((n) => (
                  <li key={n.id} className="flex gap-3">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.read ? 'bg-line' : 'bg-cargo'}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{n.title}</p>
                      <p className="text-xs text-ink-mid">{timeAgo(n.createdAt)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
