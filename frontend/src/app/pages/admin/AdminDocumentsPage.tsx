import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderClosed, FileText, Lock, Unlock } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Spinner from '../../components/shared/Spinner';
import EmptyState from '../../components/shared/EmptyState';
import * as shipmentsService from '../../services/shipmentsService';
import type { Shipment } from '../../types';
import { formatDate } from '../../utils/format';

const typeLabels: Record<string, string> = {
  commercial_invoice: 'Commercial invoice',
  packing_list: 'Packing list',
  bill_of_lading: 'Bill of lading',
  customs_document: 'Customs document',
  proof_of_delivery: 'Proof of delivery',
  other: 'Other',
};

export default function AdminDocumentsPage() {
  const [shipments, setShipments] = useState<Shipment[] | null>(null);

  useEffect(() => {
    shipmentsService.listAllShipments().then(setShipments);
  }, []);

  const docs = (shipments ?? [])
    .flatMap((s) => s.documents.map((d) => ({ ...d, shipment: s })))
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));

  return (
    <div className="p-6 lg:p-10">
      <PageHeader title="Documents" description="All documents uploaded across every customer shipment." />

      {!shipments ? (
        <Spinner label="Loading documents" />
      ) : docs.length === 0 ? (
        <EmptyState icon={<FolderClosed size={20} />} title="No documents yet" description="Documents uploaded to shipments will appear here." />
      ) : (
        <div className="overflow-hidden rounded-sm border border-line bg-white">
          <ul className="divide-y divide-line">
            {docs.map((doc) => (
              <li key={doc.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <FileText size={18} className="shrink-0 text-ink-mid" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-medium text-ink">{doc.name}</p>
                  <p className="text-xs text-ink-mid">
                    {typeLabels[doc.type]} · {doc.sizeLabel} · {formatDate(doc.uploadedAt)}
                  </p>
                </div>
                <Link to={`/admin/shipments/${doc.shipment.id}`} className="text-xs font-medium text-cargo hover:text-cargo-dark">
                  {doc.shipment.reference}
                </Link>
                <span className="flex items-center gap-1.5 text-xs text-ink-mid">
                  {doc.restricted ? <Lock size={14} /> : <Unlock size={14} />}
                  {doc.restricted ? 'Staff only' : 'Customer visible'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
