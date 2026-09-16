import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, FileText, Download, Lock, Unlock } from 'lucide-react';
import Spinner from '../../components/shared/Spinner';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { TextInput, TextArea, Select } from '../../components/ui/Field';
import TrackingTimeline from '../../components/shared/TrackingTimeline';
import ShipmentPipelineStepper from '../../components/shared/ShipmentPipelineStepper';
import * as shipmentsService from '../../services/shipmentsService';
import type { Shipment, ShipmentStatus, ShipmentDocument } from '../../types';
import { shipmentStatusLabels, shipmentStatusTone } from '../../utils/status';
import { formatDate } from '../../utils/format';

const statusOptions: { value: ShipmentStatus; label: string }[] = Object.entries(shipmentStatusLabels).map(
  ([value, label]) => ({ value: value as ShipmentStatus, label })
);

const docTypeOptions: { value: ShipmentDocument['type']; label: string }[] = [
  { value: 'commercial_invoice', label: 'Commercial invoice' },
  { value: 'packing_list', label: 'Packing list' },
  { value: 'bill_of_lading', label: 'Bill of lading' },
  { value: 'customs_document', label: 'Customs document' },
  { value: 'proof_of_delivery', label: 'Proof of delivery' },
  { value: 'other', label: 'Other' },
];

export default function AdminShipmentDetailPage() {
  const { id } = useParams();
  const [shipment, setShipment] = useState<Shipment | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  const [eventStatus, setEventStatus] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<ShipmentDocument['type']>('other');
  const [docRestricted, setDocRestricted] = useState(false);

  async function load() {
    if (!id) return;
    const s = await shipmentsService.getShipment(id);
    setShipment(s);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <Link to="/admin/shipments" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-cargo">
          <ArrowLeft size={14} /> Back to shipments
        </Link>
      </div>
    );
  }

  async function handleStatusChange(status: ShipmentStatus) {
    if (!id) return;
    setBusy(true);
    await shipmentsService.updateShipmentStatus(id, status);
    await load();
    setBusy(false);
  }

  async function handleAddEvent() {
    if (!id || !eventStatus.trim() || !eventLocation.trim()) return;
    setBusy(true);
    await shipmentsService.addTrackingEvent(id, {
      status: eventStatus,
      location: eventLocation,
      description: eventDescription,
      timestamp: new Date().toISOString(),
    });
    setEventStatus('');
    setEventLocation('');
    setEventDescription('');
    await load();
    setBusy(false);
  }

  async function handleAddDocument() {
    if (!id || !docName.trim()) return;
    setBusy(true);
    await shipmentsService.addDocument(id, {
      name: docName,
      type: docType,
      sizeLabel: `${(Math.random() * 400 + 60).toFixed(0)} KB`,
      restricted: docRestricted,
    });
    setDocName('');
    setDocType('other');
    setDocRestricted(false);
    await load();
    setBusy(false);
  }

  return (
    <div className="p-6 lg:p-10">
      <Link to="/admin/shipments" className="flex items-center gap-1.5 text-sm font-medium text-ink-mid hover:text-ink">
        <ArrowLeft size={14} /> Back to shipments
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-ink-mid">{shipment.reference}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">
            {shipment.origin} → {shipment.destination}
          </h1>
          <p className="mt-1 text-sm text-ink-mid">
            <Link to={`/admin/customers/${shipment.customerId}`} className="font-medium text-cargo hover:text-cargo-dark">
              {shipment.customerName}
            </Link>{' '}
            · {shipment.goodsDescription}
          </p>
        </div>
        <StatusBadge label={shipmentStatusLabels[shipment.status]} tone={shipmentStatusTone(shipment.status)} />
      </div>

      <div className="mt-8 rounded-sm border border-line bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ShipmentPipelineStepper status={shipment.status} />
          <Select
            id="statusSelect"
            label=""
            options={statusOptions}
            value={shipment.status}
            onChange={(e) => handleStatusChange(e.target.value as ShipmentStatus)}
            className="w-48"
          />
        </div>
        <p className="mt-3 text-xs text-ink-mid">Est. delivery {formatDate(shipment.estimatedDelivery)}</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="rounded-sm border border-line bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Shipment activity</h2>
            <div className="mt-4">
              <TrackingTimeline events={shipment.events} />
            </div>

            <div className="mt-6 border-t border-line pt-6">
              <h3 className="text-sm font-semibold text-ink">Add tracking event</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <TextInput id="eventStatus" label="Status label" value={eventStatus} onChange={(e) => setEventStatus(e.target.value)} placeholder="e.g. Departed origin port" />
                <TextInput id="eventLocation" label="Location" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="e.g. Apapa Port, Lagos" />
              </div>
              <div className="mt-3">
                <TextArea id="eventDescription" label="Description" rows={2} value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} placeholder="Optional details" />
              </div>
              <Button
                className="mt-3"
                size="sm"
                variant="secondary"
                icon={<Plus size={14} />}
                iconPosition="left"
                disabled={busy || !eventStatus.trim() || !eventLocation.trim()}
                onClick={handleAddEvent}
              >
                Add event
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-sm border border-line bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Documents</h2>
            {shipment.documents.length === 0 ? (
              <p className="mt-3 text-sm text-ink-mid">No documents uploaded.</p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2.5">
                {shipment.documents.map((doc) => (
                  <li key={doc.id} className="flex items-center gap-2.5 rounded-sm border border-line px-3 py-2.5">
                    <FileText size={15} className="shrink-0 text-ink-mid" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{doc.name}</p>
                      <p className="text-xs text-ink-mid">{doc.sizeLabel} · {formatDate(doc.uploadedAt)}</p>
                    </div>
                    {doc.restricted ? <Lock size={14} className="shrink-0 text-ink-mid" /> : <Download size={14} className="shrink-0 text-ink-mid" />}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-5 border-t border-line pt-5">
              <h3 className="text-sm font-semibold text-ink">Upload document</h3>
              <div className="mt-3 flex flex-col gap-3">
                <TextInput id="docName" label="File name" value={docName} onChange={(e) => setDocName(e.target.value)} placeholder="e.g. Commercial Invoice.pdf" />
                <Select id="docType" label="Document type" value={docType} onChange={(e) => setDocType(e.target.value as ShipmentDocument['type'])} options={docTypeOptions} />
                <button
                  type="button"
                  onClick={() => setDocRestricted((v) => !v)}
                  className="flex items-center gap-2 self-start text-sm text-ink-mid hover:text-ink"
                >
                  {docRestricted ? <Lock size={15} /> : <Unlock size={15} />}
                  {docRestricted ? 'Restricted to staff' : 'Visible to customer'}
                </button>
                <Button size="sm" disabled={busy || !docName.trim()} onClick={handleAddDocument} icon={<Plus size={14} />} iconPosition="left">
                  Upload
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-line bg-white p-6">
            <h3 className="text-sm font-semibold text-ink">References</h3>
            <dl className="mt-3 flex flex-col gap-2 text-sm">
              {shipment.containerNumber && <div className="flex justify-between"><dt className="text-ink-mid">Container</dt><dd className="font-mono text-ink">{shipment.containerNumber}</dd></div>}
              {shipment.billOfLading && <div className="flex justify-between"><dt className="text-ink-mid">Bill of lading</dt><dd className="font-mono text-ink">{shipment.billOfLading}</dd></div>}
              {shipment.carrier && <div className="flex justify-between"><dt className="text-ink-mid">Carrier</dt><dd className="text-ink">{shipment.carrier}</dd></div>}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
