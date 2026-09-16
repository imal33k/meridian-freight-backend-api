import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Building2, Globe } from 'lucide-react';
import Spinner from '../../components/shared/Spinner';
import StatusBadge from '../../components/ui/StatusBadge';
import * as customersService from '../../services/customersService';
import * as requestsService from '../../services/requestsService';
import * as shipmentsService from '../../services/shipmentsService';
import type { UserProfile, ExportRequest, Shipment } from '../../types';
import { requestStatusLabels, requestStatusTone, shipmentStatusLabels, shipmentStatusTone } from '../../utils/status';
import { formatDate } from '../../utils/format';

export default function AdminCustomerDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<UserProfile | null | undefined>(undefined);
  const [requests, setRequests] = useState<ExportRequest[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    if (!id) return;
    customersService.getCustomer(id).then(setCustomer);
    requestsService.listAllRequests().then((all) => setRequests(all.filter((r) => r.customerId === id)));
    shipmentsService.listAllShipments().then((all) => setShipments(all.filter((s) => s.customerId === id)));
  }, [id]);

  if (customer === undefined) {
    return (
      <div className="p-6 lg:p-10">
        <Spinner label="Loading customer" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6 lg:p-10">
        <p className="text-[15px] text-ink-mid">Customer not found.</p>
        <Link to="/admin/customers" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-cargo">
          <ArrowLeft size={14} /> Back to customers
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <Link to="/admin/customers" className="flex items-center gap-1.5 text-sm font-medium text-ink-mid hover:text-ink">
        <ArrowLeft size={14} /> Back to customers
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-lg font-semibold text-white">
          {customer.firstName[0]}{customer.lastName[0]}
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{customer.firstName} {customer.lastName}</h1>
          <p className="text-sm text-ink-mid">{customer.company}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-sm border border-line bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Contact details</h2>
          <dl className="mt-4 flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-2.5">
              <Mail size={15} className="text-ink-mid" />
              <a href={`mailto:${customer.email}`} className="text-ink hover:text-cargo">{customer.email}</a>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone size={15} className="text-ink-mid" />
              <span className="text-ink">{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Building2 size={15} className="text-ink-mid" />
              <span className="text-ink">{customer.company}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Globe size={15} className="text-ink-mid" />
              <span className="text-ink">{customer.country}</span>
            </div>
          </dl>
          <div className="mt-5 border-t border-line pt-4 text-xs text-ink-mid">
            Customer since {formatDate(customer.createdAt)} · {customer.emailVerified ? 'Email verified' : 'Email not verified'}
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Requests ({requests.length})</h2>
            <div className="mt-3 overflow-hidden rounded-sm border border-line bg-white">
              {requests.length === 0 ? (
                <p className="p-5 text-sm text-ink-mid">No requests submitted.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {requests.map((r) => (
                    <li key={r.id}>
                      <Link to={`/admin/requests/${r.id}`} className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-paper-dim">
                        <div className="min-w-0">
                          <p className="font-mono text-xs text-ink-mid">{r.reference}</p>
                          <p className="truncate text-sm font-medium text-ink">{r.origin} → {r.destination}</p>
                        </div>
                        <StatusBadge label={requestStatusLabels[r.status]} tone={requestStatusTone(r.status)} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ink">Shipments ({shipments.length})</h2>
            <div className="mt-3 overflow-hidden rounded-sm border border-line bg-white">
              {shipments.length === 0 ? (
                <p className="p-5 text-sm text-ink-mid">No shipments yet.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {shipments.map((s) => (
                    <li key={s.id}>
                      <Link to={`/admin/shipments/${s.id}`} className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-paper-dim">
                        <div className="min-w-0">
                          <p className="font-mono text-xs text-ink-mid">{s.reference}</p>
                          <p className="truncate text-sm font-medium text-ink">{s.origin} → {s.destination}</p>
                        </div>
                        <StatusBadge label={shipmentStatusLabels[s.status]} tone={shipmentStatusTone(s.status)} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
