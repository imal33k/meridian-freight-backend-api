import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import StatCard from '../../components/shared/StatCard';
import Spinner from '../../components/shared/Spinner';
import StatusBadge from '../../components/ui/StatusBadge';
import * as shipmentsService from '../../services/shipmentsService';
import * as requestsService from '../../services/requestsService';
import * as customersService from '../../services/customersService';
import * as contactService from '../../services/contactService';
import type { Shipment, ExportRequest, UserProfile, ContactMessage } from '../../types';
import { shipmentStatusLabels, shipmentStatusTone, requestStatusLabels, requestStatusTone } from '../../utils/status';
import { formatDate } from '../../utils/format';

export default function AdminOverviewPage() {
  const [shipments, setShipments] = useState<Shipment[] | null>(null);
  const [requests, setRequests] = useState<ExportRequest[] | null>(null);
  const [customers, setCustomers] = useState<UserProfile[] | null>(null);
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);

  useEffect(() => {
    shipmentsService.listAllShipments().then(setShipments);
    requestsService.listAllRequests().then(setRequests);
    customersService.listCustomers().then(setCustomers);
    contactService.listMessages().then(setMessages);
  }, []);

  if (!shipments || !requests || !customers || !messages) {
    return (
      <div className="p-6 lg:p-10">
        <Spinner label="Loading operations data" />
      </div>
    );
  }

  const activeShipments = shipments.filter((s) => s.status !== 'delivered');
  const pendingRequests = requests.filter((r) => ['pending', 'under_review'].includes(r.status));
  const delivered = shipments.filter((s) => s.status === 'delivered');
  const newMessages = messages.filter((m) => m.status === 'new');

  const recentRequests = [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const recentShipments = [...shipments].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5);

  return (
    <div className="p-6 lg:p-10">
      <PageHeader title="Operations overview" description="A snapshot of customers, requests and shipments across the business." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total customers" value={customers.length} icon={<Users size={18} />} />
        <StatCard label="Active shipments" value={activeShipments.length} icon={<Package size={18} />} />
        <StatCard label="Pending requests" value={pendingRequests.length} icon={<Clock size={18} />} />
        <StatCard label="Delivered shipments" value={delivered.length} icon={<CheckCircle2 size={18} />} />
      </div>

      {newMessages.length > 0 && (
        <div className="mt-6 flex items-center justify-between rounded-sm border border-cargo/30 bg-cargo/5 px-5 py-3.5">
          <p className="text-sm font-medium text-ink">
            {newMessages.length} new contact {newMessages.length === 1 ? 'message' : 'messages'} awaiting response.
          </p>
          <Link to="/admin/messages" className="flex items-center gap-1 text-sm font-medium text-cargo hover:text-cargo-dark">
            View messages <ArrowRight size={14} />
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ink">Recent requests</h2>
            <Link to="/admin/requests" className="flex items-center gap-1 text-sm font-medium text-cargo hover:text-cargo-dark">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-sm border border-line bg-white">
            <ul className="divide-y divide-line">
              {recentRequests.map((r) => (
                <li key={r.id}>
                  <Link to={`/admin/requests/${r.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-paper-dim">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-ink-mid">{r.reference}</p>
                      <p className="mt-0.5 truncate text-[15px] font-medium text-ink">{r.origin} → {r.destination}</p>
                      <p className="mt-0.5 text-xs text-ink-mid">{formatDate(r.createdAt)}</p>
                    </div>
                    <StatusBadge label={requestStatusLabels[r.status]} tone={requestStatusTone(r.status)} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-ink">Recent shipment activity</h2>
            <Link to="/admin/shipments" className="flex items-center gap-1 text-sm font-medium text-cargo hover:text-cargo-dark">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-4 overflow-hidden rounded-sm border border-line bg-white">
            <ul className="divide-y divide-line">
              {recentShipments.map((s) => (
                <li key={s.id}>
                  <Link to={`/admin/shipments/${s.id}`} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-paper-dim">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-ink-mid">{s.reference}</p>
                      <p className="mt-0.5 truncate text-[15px] font-medium text-ink">{s.customerName}</p>
                      <p className="mt-0.5 text-xs text-ink-mid">{s.origin} → {s.destination}</p>
                    </div>
                    <StatusBadge label={shipmentStatusLabels[s.status]} tone={shipmentStatusTone(s.status)} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
