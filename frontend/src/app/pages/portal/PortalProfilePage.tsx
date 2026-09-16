import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import { TextInput } from '../../components/ui/Field';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function PortalProfilePage() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    company: user?.company ?? '',
    country: user?.country ?? '',
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    refreshUser({ ...user, ...form });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="p-6 lg:p-10">
      <PageHeader title="Profile" description="Manage your account and company details." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="rounded-sm border border-line bg-white p-6 sm:p-8">
            {saved && (
              <div className="mb-6 flex items-center gap-2.5 rounded-sm border border-success/30 bg-success/5 px-4 py-3 text-sm text-success">
                <CheckCircle2 size={16} /> Profile updated successfully.
              </div>
            )}
            <div className="grid gap-5 sm:grid-cols-2">
              <TextInput id="firstName" label="First name" value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} />
              <TextInput id="lastName" label="Last name" value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} />
            </div>
            <div className="mt-5">
              <TextInput id="email" type="email" label="Email address" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <TextInput id="phone" type="tel" label="Phone number" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              <TextInput id="country" label="Country" value={form.country} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} />
            </div>
            <div className="mt-5">
              <TextInput id="company" label="Company" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
            </div>
            <div className="mt-7 flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </form>
        </div>

        <div>
          <div className="rounded-sm border border-line bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-ink">Account status</h3>
            <dl className="mt-4 flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-mid">Email verified</dt>
                <dd className="font-medium text-success">{user?.emailVerified ? 'Yes' : 'Pending'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-mid">Account type</dt>
                <dd className="font-medium capitalize text-ink">{user?.role}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-mid">Member since</dt>
                <dd className="font-medium text-ink">
                  {user ? new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : ''}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
