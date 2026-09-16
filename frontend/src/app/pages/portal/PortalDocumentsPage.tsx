import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderClosed, FileText, Download, Lock } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Spinner from '../../components/shared/Spinner';
import EmptyState from '../../components/shared/EmptyState';
import { useAuth } from '../../context/AuthContext';
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

export default function PortalDocumentsPage() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<Shipment[] | null>(null);

  useEffect(() => {
    if (!user) return;
    shipmentsService.listShipmentsForCustomer(user.id).then(setShipments);
  }, [user]);

  const docs = (shipments ?? []).flatMap((s) => s.documents.map((d) => ({ ...d, shipment: s })));

  return (
    <div className="p-6 lg:p-10">
      <PageHeader title="Documents" description="Shipment documents you're authorized to access, across all your shipments." />

      {!shipments ? (
        <Spinner label="Loading documents" />
      ) : docs.length === 0 ? (
        <EmptyState icon={<FolderClosed size={20} />} title="No documents yet" description="Documents will appear here once your shipments are underway." />
      ) : (
        <div className="overflow-hidden rounded-sm border border-line bg-white">
          <ul className="divide-y divide-line">
            {docs.map((doc) => (
              <li key={doc.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                <FileText size={18} className="shrink-0 text-ink-mid" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-medium text-ink">{doc.name}</p>
                  <p className="text-xs text-ink-mid">
                    {typeLabels[doc.type]} · {doc.sizeLabel} · Uploaded {formatDate(doc.uploadedAt)}
                  </p>
                  <Link to={`/portal/shipments/${doc.shipment.id}`} className="text-xs font-medium text-cargo hover:text-cargo-dark">
                    {doc.shipment.reference}
                  </Link>
                </div>
                {doc.restricted ? (
                  <span className="flex items-center gap-1.5 text-xs text-ink-mid" title="Restricted document">
                    <Lock size={14} /> Restricted
                  </span>
                ) : (
                  <button className="flex items-center gap-1.5 rounded-sm border border-line px-3 py-1.5 text-xs font-medium text-ink hover:border-ink">
                    <Download size={13} /> Download
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
