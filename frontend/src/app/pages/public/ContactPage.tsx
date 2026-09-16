import { useState, type FormEvent } from 'react';
import { Mail, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { TextInput, TextArea } from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import * as contactService from '../../services/contactService';

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
}

const initialForm: FormState = { name: '', email: '', phone: '', company: '', subject: '', message: '' };

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!form.email.trim()) next.email = 'Please enter your email address.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.';
    if (!form.subject.trim()) next.subject = 'Please add a subject.';
    if (!form.message.trim() || form.message.trim().length < 10)
      next.message = 'Please write a message of at least 10 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    try {
      await contactService.sendMessage(form);
      setStatus('success');
      setForm(initialForm);
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="container-page py-14 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-mono text-xs uppercase tracking-wider text-cargo">Contact</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-ink">
            Talk to our operations team.
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-mid">
            Send us a message about an export/import request, a partnership enquiry, or anything else. We
            typically respond within one business day.
          </p>

          <div className="mt-10 flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-cargo" />
              <p className="text-[15px] text-ink-mid">14 Marina Trade Centre, Lagos Island, Lagos, Nigeria</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="shrink-0 text-cargo" />
              <a href="tel:+2342017001200" className="text-[15px] text-ink-mid hover:text-ink">
                +234 201 700 1200
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="shrink-0 text-cargo" />
              <a href="mailto:operations@meridianfreight.com" className="text-[15px] text-ink-mid hover:text-ink">
                operations@meridianfreight.com
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {status === 'success' ? (
            <div className="flex flex-col items-start gap-3 rounded-sm border border-success/30 bg-success/5 p-8">
              <CheckCircle2 size={28} className="text-success" />
              <h2 className="font-display text-2xl font-semibold text-ink">Message sent</h2>
              <p className="text-[15px] text-ink-mid">
                Thanks for reaching out — our team will respond to your enquiry within one business day.
              </p>
              <Button variant="ghost" onClick={() => setStatus('idle')}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 rounded-sm border border-line bg-white p-6 sm:p-8">
              {status === 'error' && (
                <div className="flex items-center gap-2.5 rounded-sm border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
                  <AlertCircle size={16} />
                  Something went wrong sending your message. Please try again.
                </div>
              )}
              <div className="grid gap-5 sm:grid-cols-2">
                <TextInput id="name" label="Full name" required value={form.name} onChange={update('name')} error={errors.name} placeholder="Chioma Nwankwo" />
                <TextInput id="email" type="email" label="Email address" required value={form.email} onChange={update('email')} error={errors.email} placeholder="you@company.com" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <TextInput id="phone" type="tel" label="Phone number" value={form.phone} onChange={update('phone')} placeholder="+234 800 000 0000" />
                <TextInput id="company" label="Company" value={form.company} onChange={update('company')} placeholder="Optional" />
              </div>
              <TextInput id="subject" label="Subject" required value={form.subject} onChange={update('subject')} error={errors.subject} placeholder="e.g. Export documentation question" />
              <TextArea id="message" label="Message" required rows={6} value={form.message} onChange={update('message')} error={errors.message} placeholder="Tell us what you need help with…" />
              <Button type="submit" disabled={status === 'submitting'} fullWidth size="lg">
                {status === 'submitting' ? 'Sending…' : 'Send message'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
