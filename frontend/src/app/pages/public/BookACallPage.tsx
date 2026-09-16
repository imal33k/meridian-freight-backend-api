import { useState, type FormEvent } from 'react';
import { CheckCircle2, AlertCircle, CalendarDays, Clock } from 'lucide-react';
import { TextInput, TextArea, Select } from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import * as bookingsService from '../../services/bookingsService';
import type { BookingReason } from '../../types';

const reasonOptions: { value: BookingReason; label: string }[] = [
  { value: 'export_consultation', label: 'Export consultation' },
  { value: 'import_consultation', label: 'Import consultation' },
  { value: 'freight_quote', label: 'Request a freight quote' },
  { value: 'customs_support', label: 'Customs & documentation support' },
  { value: 'general_enquiry', label: 'General enquiry' },
];

const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:30', '16:00'];

function nextBusinessDays(count: number): string[] {
  const days: string[] = [];
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (days.length < count) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) days.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

const availableDates = nextBusinessDays(6);

interface FormState {
  reason: BookingReason | '';
  date: string;
  time: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
}

const initialForm: FormState = {
  reason: '',
  date: '',
  time: '',
  fullName: '',
  email: '',
  phone: '',
  company: '',
  notes: '',
};

export default function BookACallPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.reason) next.reason = 'Please select a reason for the call.';
    if (!form.date) next.date = 'Please choose a date.';
    if (!form.time) next.time = 'Please choose a time.';
    if (!form.fullName.trim()) next.fullName = 'Please enter your full name.';
    if (!form.email.trim()) next.email = 'Please enter your email address.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.phone.trim()) next.phone = 'Please enter a phone number.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    try {
      await bookingsService.createBooking({
        reason: form.reason as BookingReason,
        date: form.date,
        time: form.time,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        company: form.company || undefined,
        notes: form.notes || undefined,
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    const reasonLabel = reasonOptions.find((r) => r.value === form.reason)?.label;
    return (
      <div className="container-page flex justify-center py-20">
        <div className="flex max-w-lg flex-col items-start gap-4 rounded-sm border border-success/30 bg-success/5 p-10 text-left">
          <CheckCircle2 size={32} className="text-success" />
          <h1 className="font-display text-3xl font-semibold text-ink">Call confirmed</h1>
          <p className="text-[15px] text-ink-mid">
            We've scheduled your {reasonLabel?.toLowerCase()} for{' '}
            <span className="font-medium text-ink">
              {new Date(form.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>{' '}
            at <span className="font-medium text-ink">{form.time}</span>. A confirmation has been sent to{' '}
            <span className="font-medium text-ink">{form.email}</span>.
          </p>
          <Button
            variant="ghost"
            onClick={() => {
              setForm(initialForm);
              setStatus('idle');
            }}
          >
            Book another call
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-14 lg:py-20">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-wider text-cargo">Book a call</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink">
          Schedule time with our team.
        </h1>
        <p className="mt-3 text-[15px] text-ink-mid">
          Pick a reason, a date and a time that works for you. Calls run 20–30 minutes.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-10 flex flex-col gap-6 rounded-sm border border-line bg-white p-6 sm:p-8">
          {status === 'error' && (
            <div className="flex items-center gap-2.5 rounded-sm border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
              <AlertCircle size={16} />
              We couldn't confirm your booking. Please try again.
            </div>
          )}

          <Select
            id="reason"
            label="Reason for the call"
            required
            placeholder="Select a reason"
            options={reasonOptions}
            value={form.reason}
            error={errors.reason}
            onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value as BookingReason }))}
          />

          <div>
            <p className="mb-2 text-sm font-medium text-ink">
              Select a date <span className="text-cargo">*</span>
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {availableDates.map((d) => {
                const date = new Date(d);
                const active = form.date === d;
                return (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setForm((f) => ({ ...f, date: d }))}
                    className={`flex flex-col items-center gap-0.5 rounded-sm border px-2 py-2.5 text-center transition-colors ${
                      active ? 'border-ink bg-ink text-white' : 'border-line text-ink-mid hover:border-ink/40'
                    }`}
                  >
                    <span className="text-[11px] uppercase">{date.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                    <span className="text-sm font-semibold">{date.getDate()}</span>
                  </button>
                );
              })}
            </div>
            {errors.date && <p className="mt-1.5 text-sm text-danger">{errors.date}</p>}
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-ink">
              Select a time <span className="text-cargo">*</span>
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {timeSlots.map((t) => {
                const active = form.time === t;
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setForm((f) => ({ ...f, time: t }))}
                    className={`rounded-sm border px-2 py-2.5 text-sm font-medium transition-colors ${
                      active ? 'border-ink bg-ink text-white' : 'border-line text-ink-mid hover:border-ink/40'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            {errors.time && <p className="mt-1.5 text-sm text-danger">{errors.time}</p>}
          </div>

          {form.date && form.time && (
            <div className="flex items-center gap-4 rounded-sm bg-paper-dim px-4 py-3 text-sm text-ink-mid">
              <span className="flex items-center gap-1.5">
                <CalendarDays size={15} />
                {new Date(form.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={15} />
                {form.time}
              </span>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <TextInput id="fullName" label="Full name" required value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} error={errors.fullName} />
            <TextInput id="email" type="email" label="Email address" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} error={errors.email} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextInput id="phone" type="tel" label="Phone number" required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} error={errors.phone} />
            <TextInput id="company" label="Company" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} placeholder="Optional" />
          </div>
          <TextArea id="notes" label="Anything we should know beforehand?" rows={3} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />

          <Button type="submit" disabled={status === 'submitting'} size="lg" fullWidth>
            {status === 'submitting' ? 'Confirming…' : 'Confirm booking'}
          </Button>
        </form>
      </div>
    </div>
  );
}
