import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import { TextInput, TextArea, Select } from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import * as requestsService from '../../services/requestsService';
import type { ShipmentType, TransportMethod } from '../../types';

interface FormState {
  type: ShipmentType;
  origin: string;
  destination: string;
  goodsType: string;
  goodsDescription: string;
  quantity: string;
  weightKg: string;
  dimensions: string;
  transportMethod: TransportMethod;
  pickupAddress: string;
  deliveryAddress: string;
  additionalInfo: string;
}

const initialForm: FormState = {
  type: 'export',
  origin: '',
  destination: '',
  goodsType: '',
  goodsDescription: '',
  quantity: '',
  weightKg: '',
  dimensions: '',
  transportMethod: 'sea',
  pickupAddress: '',
  deliveryAddress: '',
  additionalInfo: '',
};

export default function NewRequestPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [reference, setReference] = useState('');

  const update =
    (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.origin.trim()) next.origin = 'Required';
    if (!form.destination.trim()) next.destination = 'Required';
    if (!form.goodsType.trim()) next.goodsType = 'Required';
    if (!form.goodsDescription.trim()) next.goodsDescription = 'Required';
    if (!form.quantity.trim()) next.quantity = 'Required';
    if (!form.weightKg.trim() || Number.isNaN(Number(form.weightKg)) || Number(form.weightKg) <= 0)
      next.weightKg = 'Enter a valid weight in kg.';
    if (!form.dimensions.trim()) next.dimensions = 'Required';
    if (!form.pickupAddress.trim()) next.pickupAddress = 'Required';
    if (!form.deliveryAddress.trim()) next.deliveryAddress = 'Required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate() || !user) return;
    setStatus('submitting');
    try {
      const created = await requestsService.createRequest({
        customerId: user.id,
        type: form.type,
        origin: form.origin,
        destination: form.destination,
        goodsType: form.goodsType,
        goodsDescription: form.goodsDescription,
        quantity: form.quantity,
        weightKg: Number(form.weightKg),
        dimensions: form.dimensions,
        transportMethod: form.transportMethod,
        pickupAddress: form.pickupAddress,
        deliveryAddress: form.deliveryAddress,
        additionalInfo: form.additionalInfo || undefined,
      });
      setReference(created.reference);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="p-6 lg:p-10">
        <div className="mx-auto flex max-w-lg flex-col items-start gap-4 rounded-sm border border-success/30 bg-success/5 p-8">
          <CheckCircle2 size={28} className="text-success" />
          <h1 className="font-display text-2xl font-semibold text-ink">Request submitted</h1>
          <p className="text-[15px] text-ink-mid">
            Your request <span className="font-mono font-medium text-ink">{reference}</span> has been received
            and is now pending review. We'll notify you once a quote is ready.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate('/portal/requests')}>
              View my requests
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setForm(initialForm);
                setStatus('idle');
              }}
            >
              Submit another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <PageHeader title="New shipment request" description="Tell us about the goods you need to import or export." />

      <form onSubmit={handleSubmit} noValidate className="max-w-3xl rounded-sm border border-line bg-white p-6 sm:p-8">
        {status === 'error' && (
          <div className="mb-6 flex items-center gap-2.5 rounded-sm border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            <AlertCircle size={16} />
            Something went wrong submitting your request. Please try again.
          </div>
        )}

        <fieldset className="flex flex-col gap-5">
          <legend className="mb-1 font-display text-lg font-semibold text-ink">Shipment type</legend>
          <div className="grid grid-cols-2 gap-3">
            {(['export', 'import'] as ShipmentType[]).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                className={`rounded-sm border px-4 py-3 text-sm font-medium capitalize transition-colors ${
                  form.type === t ? 'border-ink bg-ink text-white' : 'border-line text-ink-mid hover:border-ink/40'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="my-7 border-t border-line" />

        <h2 className="mb-4 font-display text-lg font-semibold text-ink">Route</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput id="origin" label="Origin" required value={form.origin} onChange={update('origin')} error={errors.origin} placeholder="e.g. Lagos, Nigeria" />
          <TextInput id="destination" label="Destination" required value={form.destination} onChange={update('destination')} error={errors.destination} placeholder="e.g. Rotterdam, Netherlands" />
        </div>

        <div className="my-7 border-t border-line" />

        <h2 className="mb-4 font-display text-lg font-semibold text-ink">Goods information</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput id="goodsType" label="Goods type" required value={form.goodsType} onChange={update('goodsType')} error={errors.goodsType} placeholder="e.g. Agricultural produce" />
          <TextInput id="quantity" label="Quantity" required value={form.quantity} onChange={update('quantity')} error={errors.quantity} placeholder="e.g. 480 cartons" />
        </div>
        <div className="mt-5">
          <TextArea id="goodsDescription" label="Goods description" required rows={3} value={form.goodsDescription} onChange={update('goodsDescription')} error={errors.goodsDescription} placeholder="Describe the goods being shipped" />
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextInput id="weightKg" type="number" min="0" label="Weight (kg)" required value={form.weightKg} onChange={update('weightKg')} error={errors.weightKg} />
          <TextInput id="dimensions" label="Dimensions / packaging" required value={form.dimensions} onChange={update('dimensions')} error={errors.dimensions} placeholder="e.g. 1 x 20ft container" />
        </div>

        <div className="my-7 border-t border-line" />

        <h2 className="mb-4 font-display text-lg font-semibold text-ink">Transport & addresses</h2>
        <Select
          id="transportMethod"
          label="Preferred transport method"
          required
          options={[
            { value: 'sea', label: 'Sea freight' },
            { value: 'air', label: 'Air freight' },
            { value: 'land', label: 'Land freight' },
          ]}
          value={form.transportMethod}
          onChange={update('transportMethod')}
        />
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextInput id="pickupAddress" label="Pickup address" required value={form.pickupAddress} onChange={update('pickupAddress')} error={errors.pickupAddress} />
          <TextInput id="deliveryAddress" label="Delivery address" required value={form.deliveryAddress} onChange={update('deliveryAddress')} error={errors.deliveryAddress} />
        </div>
        <div className="mt-5">
          <TextArea id="additionalInfo" label="Additional information" rows={3} value={form.additionalInfo} onChange={update('additionalInfo')} hint="Optional — certificates required, handling instructions, etc." />
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button type="submit" size="lg" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Submitting…' : 'Submit request'}
          </Button>
        </div>
      </form>
    </div>
  );
}
