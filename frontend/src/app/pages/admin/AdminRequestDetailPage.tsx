import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle2 } from 'lucide-react';
import Spinner from '../../components/shared/Spinner';
import StatusBadge from '../../components/ui/StatusBadge';
import Button from '../../components/ui/Button';
import { TextInput, TextArea, Select } from '../../components/ui/Field';
import * as requestsService from '../../services/requestsService';
import * as shipmentsService from '../../services/shipmentsService';
import * as customersService from '../../services/customersService';
import type { ExportRequest, UserProfile } from '../../types';
import { requestStatusLabels, requestStatusTone } from '../../utils/status';
import { formatDate, formatWeight, formatCurrency } from '../../utils/format';

export default function AdminRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<ExportRequest | null | undefined>(undefined);
  const [customer, setCustomer] = useState<UserProfile | null>(null);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteCurrency, setQuoteCurrency] = useState('USD');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [converted, setConverted] = useState(false);

  async function load() {
    if (!id) return;
    const r = await requestsService.getRequest(id);
    setRequest(r);
    if (r) {
      const c = await customersService.getCustomer(r.customerId);
      setCustomer(c ?? null);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <Link to="/admin/requests" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-cargo">
          <ArrowLeft size={14} /> Back to requests
        </Link>
      </div>
    );
  }

  async function setStatus(status: ExportRequest['status']) {
    if (!id) return;
    setBusy(true);
    await requestsService.updateRequestStatus(id, status);
    await load();
    setBusy(false);
  }

  async function submitQuote() {
    if (!id || !quoteAmount) return;
    setBusy(true);
    await requestsService.updateRequestStatus(id, 'quote_provided', {
      amount: Number(quoteAmount),
      currency: quoteCurrency,
      notes: quoteNotes || undefined,
    });
    await load();
    setBusy(false);
  }

  async function convertToShipment() {
    if (!id || !request || !customer) return;
    setBusy(true);
    const eta = new Date();
    eta.setDate(eta.getDate() + 21);
    const shipment = await shipmentsService.createShipmentFromRequest({
      requestId: request.id,
      customerId: request.customerId,
      customerName: customer.company,
      type: request.type,
      origin: request.origin,
      destination: request.destination,
      transportMethod: request.transportMethod,
      goodsDescription: request.goodsDescription,
      weightKg: request.weightKg,
      estimatedDelivery: eta.toISOString().slice(0, 10),
    });
    await requestsService.updateRequestStatus(id, 'booked');
    setConverted(true);
    setBusy(false);
    setTimeout(() => navigate(`/admin/shipments/${shipment.id}`), 900);
  }

  return (
    <div className="p-6 lg:p-10">
      <Link to="/admin/requests" className="flex items-center gap-1.5 text-sm font-medium text-ink-mid hover:text-ink">
        <ArrowLeft size={14} /> Back to requests
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-ink-mid">{request.reference}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">
            {request.origin} → {request.destination}
          </h1>
          <p className="mt-1 text-sm text-ink-mid">
            {customer ? (
              <Link to={`/admin/customers/${customer.id}`} className="font-medium text-cargo hover:text-cargo-dark">
                {customer.company}
              </Link>
            ) : (
              '—'
            )}{' '}
            · Submitted {formatDate(request.createdAt)}
          </p>
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
              <div><dt className="text-xs text-ink-mid">Goods type</dt><dd className="mt-0.5 text-[15px] text-ink">{request.goodsType}</dd></div>
              <div><dt className="text-xs text-ink-mid">Quantity</dt><dd className="mt-0.5 text-[15px] text-ink">{request.quantity}</dd></div>
              <div><dt className="text-xs text-ink-mid">Weight</dt><dd className="mt-0.5 text-[15px] text-ink">{formatWeight(request.weightKg)}</dd></div>
              <div><dt className="text-xs text-ink-mid">Dimensions</dt><dd className="mt-0.5 text-[15px] text-ink">{request.dimensions}</dd></div>
              <div className="sm:col-span-2"><dt className="text-xs text-ink-mid">Description</dt><dd className="mt-0.5 text-[15px] text-ink">{request.goodsDescription}</dd></div>
            </dl>
          </div>

          <div className="rounded-sm border border-line bg-white p-6">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <Truck size={17} /> Transport &amp; addresses
            </h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><dt className="text-xs text-ink-mid">Transport method</dt><dd className="mt-0.5 text-[15px] capitalize text-ink">{request.transportMethod} freight</dd></div>
              <div />
              <div><dt className="text-xs text-ink-mid">Pickup address</dt><dd className="mt-0.5 text-[15px] text-ink">{request.pickupAddress}</dd></div>
              <div><dt className="text-xs text-ink-mid">Delivery address</dt><dd className="mt-0.5 text-[15px] text-ink">{request.deliveryAddress}</dd></div>
            </dl>
            {request.additionalInfo && (
              <div className="mt-4 border-t border-line pt-4">
                <dt className="text-xs text-ink-mid">Additional information</dt>
                <dd className="mt-0.5 text-[15px] text-ink">{request.additionalInfo}</dd>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-sm border border-line bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Manage status</h2>
            <div className="mt-4 flex flex-col gap-2">
              {request.status === 'pending' && (
                <Button size="sm" variant="secondary" disabled={busy} onClick={() => setStatus('under_review')}>
                  Mark as under review
                </Button>
              )}
              {(request.status === 'pending' || request.status === 'under_review') && (
                <Button size="sm" variant="ghost" disabled={busy} onClick={() => setStatus('rejected')}>
                  Reject request
                </Button>
              )}
              {(request.status === 'pending' || request.status === 'under_review') && (
                <Button size="sm" variant="ghost" disabled={busy} onClick={() => setStatus('on_hold')}>
                  Put on hold
                </Button>
              )}
              {request.status === 'quote_provided' && !converted && (
                <Button size="sm" disabled={busy} onClick={convertToShipment} icon={<CheckCircle2 size={15} />} iconPosition="left">
                  Accept &amp; create shipment
                </Button>
              )}
              {converted && (
                <p className="flex items-center gap-1.5 text-sm font-medium text-success">
                  <CheckCircle2 size={15} /> Shipment created — redirecting…
                </p>
              )}
              {!['rejected', 'cancelled', 'booked'].includes(request.status) && request.status !== 'pending' && request.status !== 'quote_provided' && (
                <p className="text-xs text-ink-mid">No further status actions available.</p>
              )}
            </div>
          </div>

          {(request.status === 'under_review' || request.status === 'pending' || request.status === 'quote_provided') && (
            <div className="rounded-sm border border-line bg-white p-6">
              <h2 className="font-display text-lg font-semibold text-ink">Provide a quote</h2>
              <div className="mt-4 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <TextInput id="quoteAmount" type="number" min="0" label="Amount" value={quoteAmount} onChange={(e) => setQuoteAmount(e.target.value)} placeholder="4200" />
                  <Select
                    id="quoteCurrency"
                    label="Currency"
                    value={quoteCurrency}
                    onChange={(e) => setQuoteCurrency(e.target.value)}
                    options={[
                      { value: 'USD', label: 'USD' },
                      { value: 'NGN', label: 'NGN' },
                      { value: 'EUR', label: 'EUR' },
                      { value: 'GBP', label: 'GBP' },
                    ]}
                  />
                </div>
                <TextArea id="quoteNotes" label="Notes" rows={3} value={quoteNotes} onChange={(e) => setQuoteNotes(e.target.value)} placeholder="What's included / excluded" />
                <Button disabled={busy || !quoteAmount} onClick={submitQuote}>
                  {request.quoteAmount ? 'Update quote' : 'Send quote'}
                </Button>
              </div>
              {request.quoteAmount && (
                <p className="mt-4 border-t border-line pt-4 text-sm text-ink-mid">
                  Current quote: <span className="font-medium text-ink">{formatCurrency(request.quoteAmount, request.quoteCurrency)}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
