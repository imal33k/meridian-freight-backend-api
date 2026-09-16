import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Spinner from '../../components/shared/Spinner';
import EmptyState from '../../components/shared/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import * as requestsService from '../../services/requestsService';
import type { ExportRequest } from '../../types';
import { requestStatusLabels, requestStatusTone } from '../../utils/status';
import { formatDate } from '../../utils/format';

export default function PortalRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ExportRequest[] | null>(null);

  useEffect(() => {
    if (!user) return;
    requestsService.listRequestsForCustomer(user.id).then(setRequests);
  }, [user]);

  return (
    <div className="p-6 lg:p-10">
      <PageHeader
        title="Import & export requests"
        description="Submit new shipment requests and track their review status."
        actions={
          <Button as="link" to="/portal/requests/new" icon={<Plus size={16} />} iconPosition="left">
            New request
          </Button>
        }
      />

      {!requests ? (
        <Spinner label="Loading requests" />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={<FileText size={20} />}
          title="No requests yet"
          description="Submit your first import or export request to get a quote from our team."
          action={
            <Button as="link" to="/portal/requests/new">
              Create a request
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-sm border border-line bg-white">
          {/* Desktop table */}
          <table className="hidden w-full text-left sm:table">
            <thead className="border-b border-line bg-paper-dim/60 text-xs uppercase tracking-wide text-ink-mid">
              <tr>
                <th className="px-5 py-3 font-medium">Reference</th>
                <th className="px-5 py-3 font-medium">Route</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Submitted</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {requests.map((r) => (
                <tr key={r.id} className="cursor-pointer hover:bg-paper-dim/40">
                  <td className="px-5 py-4">
                    <Link to={`/portal/requests/${r.id}`} className="font-mono text-sm text-ink hover:text-cargo">
                      {r.reference}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-[15px] text-ink">{r.origin} → {r.destination}</td>
                  <td className="px-5 py-4 text-[15px] capitalize text-ink-mid">{r.type}</td>
                  <td className="px-5 py-4 text-sm text-ink-mid">{formatDate(r.createdAt)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge label={requestStatusLabels[r.status]} tone={requestStatusTone(r.status)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <ul className="divide-y divide-line sm:hidden">
            {requests.map((r) => (
              <li key={r.id}>
                <Link to={`/portal/requests/${r.id}`} className="flex flex-col gap-2 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-ink-mid">{r.reference}</span>
                    <StatusBadge label={requestStatusLabels[r.status]} tone={requestStatusTone(r.status)} />
                  </div>
                  <p className="text-[15px] font-medium text-ink">{r.origin} → {r.destination}</p>
                  <p className="text-xs text-ink-mid capitalize">{r.type} · Submitted {formatDate(r.createdAt)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
