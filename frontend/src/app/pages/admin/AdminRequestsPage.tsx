import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Spinner from '../../components/shared/Spinner';
import EmptyState from '../../components/shared/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import * as requestsService from '../../services/requestsService';
import type { ExportRequest, RequestStatus } from '../../types';
import { requestStatusLabels, requestStatusTone } from '../../utils/status';
import { formatDate } from '../../utils/format';

const filterOptions: { value: RequestStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'under_review', label: 'Under review' },
  { value: 'quote_provided', label: 'Quote provided' },
  { value: 'booked', label: 'Booked' },
  { value: 'rejected', label: 'Rejected' },
];

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<ExportRequest[] | null>(null);
  const [filter, setFilter] = useState<RequestStatus | 'all'>('all');

  useEffect(() => {
    requestsService.listAllRequests().then(setRequests);
  }, []);

  const filtered = useMemo(() => {
    if (!requests) return [];
    return filter === 'all' ? requests : requests.filter((r) => r.status === filter);
  }, [requests, filter]);

  return (
    <div className="p-6 lg:p-10">
      <PageHeader title="Requests" description="Review incoming import/export requests and provide quotes." />

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

      {!requests ? (
        <Spinner label="Loading requests" />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<FileText size={20} />} title="No requests found" description="No requests match this filter." />
      ) : (
        <div className="overflow-hidden rounded-sm border border-line bg-white">
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
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-paper-dim/40">
                  <td className="px-5 py-4">
                    <Link to={`/admin/requests/${r.id}`} className="font-mono text-sm text-ink hover:text-cargo">{r.reference}</Link>
                  </td>
                  <td className="px-5 py-4 text-[15px] text-ink">{r.origin} → {r.destination}</td>
                  <td className="px-5 py-4 text-[15px] capitalize text-ink-mid">{r.type}</td>
                  <td className="px-5 py-4 text-sm text-ink-mid">{formatDate(r.createdAt)}</td>
                  <td className="px-5 py-4"><StatusBadge label={requestStatusLabels[r.status]} tone={requestStatusTone(r.status)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="divide-y divide-line sm:hidden">
            {filtered.map((r) => (
              <li key={r.id}>
                <Link to={`/admin/requests/${r.id}`} className="flex flex-col gap-2 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-ink-mid">{r.reference}</span>
                    <StatusBadge label={requestStatusLabels[r.status]} tone={requestStatusTone(r.status)} />
                  </div>
                  <p className="text-[15px] font-medium text-ink">{r.origin} → {r.destination}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
