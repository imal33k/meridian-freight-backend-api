import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, CalendarClock, Ship, Plane, Truck, FileText, Download, Lock } from 'lucide-react';
import Spinner from '../../components/shared/Spinner';
import StatusBadge from '../../components/ui/StatusBadge';
import TrackingTimeline from '../../components/shared/TrackingTimeline';
import ShipmentPipelineStepper from '../../components/shared/ShipmentPipelineStepper';
import * as shipmentsService from '../../services/shipmentsService';
import type { Shipment } from '../../types';
import { shipmentStatusLabels, shipmentStatusTone } from '../../utils/status';
import { formatDate } from '../../utils/format';

const modeIcon = { sea: <Ship size={15} />, air: <Plane size={15} />, land: <Truck size={15} /> };

export default function ShipmentDetailPage() {
  const { id } = useParams();
  const [shipment, setShipment] = useState<Shipment | null | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    shipmentsService.getShipment(id).then(setShipment);
  }, [id]);

  if (shipment === undefined) {
    return (
      <div className="p-6 lg:p-10">
        <Spinner label="Loading shipment" />
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="p-6 lg:p-10">
        <p className="text-[15px] text-ink-mid">Shipment not found.</p>
        <Link to="/portal/shipments" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-cargo">
          <ArrowLeft size={14} /> Back to shipments
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <Link to="/portal/shipments" className="flex items-center gap-1.5 text-sm font-medium text-ink-mid hover:text-ink">
        <ArrowLeft size={14} /> Back to shipments
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-ink-mid">{shipment.reference}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">
            {shipment.origin} → {shipment.destination}
          </h1>
          <p className="mt-1 text-sm text-ink-mid">{shipment.goodsDescription}</p>
        </div>
        <StatusBadge label={shipmentStatusLabels[shipment.status]} tone={shipmentStatusTone(shipment.status)} />
      </div>

      <div className="mt-8 rounded-sm border border-line bg-white p-6">
        <ShipmentPipelineStepper status={shipment.status} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-line bg-white p-4">
          <p className="flex items-center gap-1.5 text-xs text-ink-mid">{modeIcon[shipment.transportMethod]} Transport</p>
          <p className="mt-1.5 text-sm font-medium capitalize text-ink">{shipment.transportMethod} freight{shipment.carrier ? ` · ${shipment.carrier}` : ''}</p>
        </div>
        <div className="rounded-sm border border-line bg-white p-4">
          <p className="flex items-center gap-1.5 text-xs text-ink-mid"><MapPin size={14} /> Current status</p>
          <p className="mt-1.5 text-sm font-medium text-ink">{shipment.currentLocation}</p>
        </div>
        <div className="rounded-sm border border-line bg-white p-4">
          <p className="flex items-center gap-1.5 text-xs text-ink-mid"><CalendarClock size={14} /> Estimated delivery</p>
          <p className="mt-1.5 text-sm font-medium text-ink">{formatDate(shipment.estimatedDelivery)}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-ink">Shipment activity</h2>
          <div className="mt-4 rounded-sm border border-line bg-white p-6">
            <TrackingTimeline events={shipment.events} />
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Documents</h2>
          <div className="mt-4 rounded-sm border border-line bg-white">
            {shipment.documents.length === 0 ? (
              <p className="p-5 text-sm text-ink-mid">No documents have been uploaded yet.</p>
            ) : (
              <ul className="divide-y divide-line">
                {shipment.documents.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-3 px-4 py-3.5">
                    <FileText size={16} className="shrink-0 text-ink-mid" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{doc.name}</p>
                      <p className="text-xs text-ink-mid">{doc.sizeLabel} · {formatDate(doc.uploadedAt)}</p>
                    </div>
                    {doc.restricted ? (
                      <span title="Restricted document">
                        <Lock size={15} className="shrink-0 text-ink-mid" />
                      </span>
                    ) : (
                      <button className="shrink-0 text-ink-mid hover:text-cargo" aria-label={`Download ${doc.name}`}>
                        <Download size={16} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 rounded-sm border border-line bg-white p-5">
            <h3 className="text-sm font-semibold text-ink">Shipment references</h3>
            <dl className="mt-3 flex flex-col gap-2 text-sm">
              {shipment.containerNumber && (
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-mid">Container</dt>
                  <dd className="font-mono text-ink">{shipment.containerNumber}</dd>
                </div>
              )}
              {shipment.billOfLading && (
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-mid">Bill of lading</dt>
                  <dd className="font-mono text-ink">{shipment.billOfLading}</dd>
                </div>
              )}
              {shipment.airWaybill && (
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-mid">Air waybill</dt>
                  <dd className="font-mono text-ink">{shipment.airWaybill}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
