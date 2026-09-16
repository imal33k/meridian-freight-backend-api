import type { UserProfile } from '../types';
import { mockUsers, allShipments, mockRequests } from '../data/mockData';
import { delay } from './apiClient';

// Synthesized customer directory: combines named accounts with the
// customer names referenced on shipments/requests so the admin dashboard
// reflects a realistic multi-customer book of business.
function buildDirectory(): UserProfile[] {
  const named = new Map(mockUsers.map((u) => [u.id, u]));
  const extraIds = new Set<string>();
  allShipments.forEach((s) => extraIds.add(s.customerId));
  mockRequests.forEach((r) => extraIds.add(r.customerId));

  const synthesized: UserProfile[] = [
    {
      id: 'usr-cust-02',
      firstName: 'Chinedu',
      lastName: 'Eze',
      email: 'chinedu.eze@abujaagrotrade.com',
      phone: '+234 806 213 7781',
      company: 'Abuja AgroTrade Ltd',
      country: 'Nigeria',
      role: 'customer',
      createdAt: '2025-09-18T10:00:00Z',
      emailVerified: true,
    },
    {
      id: 'usr-cust-03',
      firstName: 'Blessing',
      lastName: 'Udo',
      email: 'blessing.udo@northgatebuilding.com',
      phone: '+234 810 334 9021',
      company: 'Northgate Building Supplies',
      country: 'Nigeria',
      role: 'customer',
      createdAt: '2025-12-01T10:00:00Z',
      emailVerified: true,
    },
    {
      id: 'usr-cust-04',
      firstName: 'Abubakar',
      lastName: 'Sani',
      email: 'abubakar.sani@sahelleather.com',
      phone: '+234 807 556 2210',
      company: 'Sahel Leather Works',
      country: 'Nigeria',
      role: 'customer',
      createdAt: '2026-02-11T10:00:00Z',
      emailVerified: true,
    },
  ];

  for (const u of synthesized) named.set(u.id, u);
  return Array.from(named.values()).filter((u) => u.role === 'customer' || extraIds.has(u.id));
}

const directory = buildDirectory();

export async function listCustomers(): Promise<UserProfile[]> {
  return delay([...directory].sort((a, b) => a.company.localeCompare(b.company)));
}

export async function getCustomer(id: string): Promise<UserProfile | undefined> {
  return delay(directory.find((c) => c.id === id));
}
