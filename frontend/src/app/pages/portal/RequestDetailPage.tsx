import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Package, Truck, ScrollText } from 'lucide-react';
import Spinner from '../../components/shared/Spinner';
import StatusBadge from '../../components/ui/StatusBadge';
import * as requestsService from '../../services/requestsService';
import type { ExportRequest } from '../../types';
import { requestStatusLabels, requestStatusTone } from '../../utils/status';
import { formatDate, formatWeight, formatCurrency } from '../../utils/format';

export default function RequestDetailPage() {
  const { id } = useParams();
  const [request, setRequest] = useState<ExportRequest | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    requestsService.getRequest(id).then(setRequest);
  }, [id]);

  if (request === undefined) {
    return (
      <div className="p-6 lg:p-10">
        <Spinner label="Loading request" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-6 lg:p-10">
        <p className="text-[15px] text-ink-mid">Request not found.</p>
        <Link to="/portal/requests" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-cargo">
          <ArrowLeft size={14} /> Back to requests
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <Link to="/portal/requests" className="flex items-center gap-1.5 text-sm font-medium text-ink-mid hover:text-ink">
        <ArrowLeft size={14} /> Back to requests
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-ink-mid">{request.reference}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">
            {request.origin} → {request.destination}
          </h1>
          <p className="mt-1 text-sm capitalize text-ink-mid">{request.type} request · Submitted {formatDate(request.createdAt)}</p>
        </div>
        <StatusBadge label={requestStatusLabels[request.status]} tone={requestStatusTone(request.status)} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-sm border border-line bg-white p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <Package size={17} /> Goods information
            </h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-ink-mid">Goods type</dt>
                <dd className="mt-0.5 text-[15px] text-ink">{request.goodsType}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-mid">Quantity</dt>
                <dd className="mt-0.5 text-[15px] text-ink">{request.quantity}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-mid">Weight</dt>
                <dd className="mt-0.5 text-[15px] text-ink">{formatWeight(request.weightKg)}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-mid">Dimensions / packaging</dt>
                <dd className="mt-0.5 text-[15px] text-ink">{request.dimensions}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-ink-mid">Description</dt>
                <dd className="mt-0.5 text-[15px] text-ink">{request.goodsDescription}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-sm border border-line bg-white p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <Truck size={17} /> Transport &amp; addresses
            </h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-ink-mid">Transport method</dt>
                <dd className="mt-0.5 text-[15px] capitalize text-ink">{request.transportMethod} freight</dd>
              </div>
              <div />
              <div>
                <dt className="flex items-center gap-1 text-xs text-ink-mid"><MapPin size={12} /> Pickup address</dt>
                <dd className="mt-0.5 text-[15px] text-ink">{request.pickupAddress}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-1 text-xs text-ink-mid"><MapPin size={12} /> Delivery address</dt>
                <dd className="mt-0.5 text-[15px] text-ink">{request.deliveryAddress}</dd>
              </div>
            </dl>
            {request.additionalInfo && (
              <div className="mt-4 border-t border-line pt-4">
                <dt className="flex items-center gap-1 text-xs text-ink-mid"><ScrollText size={12} /> Additional information</dt>
                <dd className="mt-0.5 text-[15px] text-ink">{request.additionalInfo}</dd>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-sm border border-line bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Quote</h2>
            {request.quoteAmount ? (
              <>
                <p className="mt-3 font-display text-3xl font-semibold text-ink">
                  {formatCurrency(request.quoteAmount, request.quoteCurrency)}
                </p>
                {request.quoteNotes && <p className="mt-2 text-sm text-ink-mid">{request.quoteNotes}</p>}
              </>
            ) : (
              <p className="mt-3 text-[15px] text-ink-mid">
                A quote hasn't been provided yet. Our team is reviewing your request.
              </p>
            )}
          </div>

          {request.linkedShipmentId && (
            <Link
              to={`/portal/shipments/${request.linkedShipmentId}`}
              className="block rounded-sm border border-line bg-white p-6 hover:border-ink/40"
            >
              <p className="text-sm font-medium text-cargo">Shipment created from this request</p>
              <p className="mt-1 text-sm text-ink-mid">View tracking and shipment details →</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
