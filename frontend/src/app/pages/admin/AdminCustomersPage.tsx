import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Spinner from '../../components/shared/Spinner';
import EmptyState from '../../components/shared/EmptyState';
import * as customersService from '../../services/customersService';
import type { UserProfile } from '../../types';
import { formatDate } from '../../utils/format';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<UserProfile[] | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    customersService.listCustomers().then(setCustomers);
  }, []);

  const filtered = useMemo(() => {
    if (!customers) return [];
    if (!query) return customers;
    const q = query.toLowerCase();
    return customers.filter(
      (c) => c.company.toLowerCase().includes(q) || `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [customers, query]);

  return (
    <div className="p-6 lg:p-10">
      <PageHeader title="Customers" description="Search and manage customer accounts, requests and shipments." />

      <div className="relative mb-6 max-w-md">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mid" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, company or email"
          className="w-full rounded-sm border border-line bg-white py-2.5 pl-10 pr-4 text-[15px] focus:border-ink focus:outline-none"
        />
      </div>

      {!customers ? (
        <Spinner label="Loading customers" />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Users size={20} />} title="No customers found" description="Try a different search term." />
      ) : (
        <div className="overflow-hidden rounded-sm border border-line bg-white">
          <table className="hidden w-full text-left sm:table">
            <thead className="border-b border-line bg-paper-dim/60 text-xs uppercase tracking-wide text-ink-mid">
              <tr>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium">Country</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-paper-dim/40">
                  <td className="px-5 py-4">
                    <Link to={`/admin/customers/${c.id}`} className="text-[15px] font-medium text-ink hover:text-cargo">
                      {c.firstName} {c.lastName}
                    </Link>
                    <p className="text-xs text-ink-mid">{c.email}</p>
                  </td>
                  <td className="px-5 py-4 text-[15px] text-ink-mid">{c.company}</td>
                  <td className="px-5 py-4 text-[15px] text-ink-mid">{c.country}</td>
                  <td className="px-5 py-4 text-sm text-ink-mid">{formatDate(c.createdAt)}</td>
                  <td className="px-5 py-4 text-sm text-ink-mid">{c.emailVerified ? 'Verified' : 'Unverified'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ul className="divide-y divide-line sm:hidden">
            {filtered.map((c) => (
              <li key={c.id}>
                <Link to={`/admin/customers/${c.id}`} className="flex flex-col gap-1 px-5 py-4">
                  <p className="text-[15px] font-medium text-ink">{c.firstName} {c.lastName}</p>
                  <p className="text-xs text-ink-mid">{c.company} · {c.country}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
