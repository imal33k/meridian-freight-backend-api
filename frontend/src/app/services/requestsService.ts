import type { ExportRequest } from '../types';
import { mockRequests } from '../data/mockData';
import { delay } from './apiClient';

let store: ExportRequest[] = [...mockRequests];

export async function listRequestsForCustomer(customerId: string): Promise<ExportRequest[]> {
  return delay(store.filter((r) => r.customerId === customerId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export async function listAllRequests(): Promise<ExportRequest[]> {
  return delay([...store].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export async function getRequest(id: string): Promise<ExportRequest | undefined> {
  return delay(store.find((r) => r.id === id));
}

export type NewRequestPayload = Omit<
  ExportRequest,
  'id' | 'reference' | 'status' | 'createdAt' | 'updatedAt' | 'quoteAmount' | 'quoteCurrency' | 'quoteNotes' | 'linkedShipmentId'
>;

export async function createRequest(payload: NewRequestPayload): Promise<ExportRequest> {
  await delay(null, 800);
  const seq = 400 + store.length + 1;
  const newRequest: ExportRequest = {
    ...payload,
    id: `req-${Date.now()}`,
    reference: `REQ-2026-${String(seq).padStart(6, '0')}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store = [newRequest, ...store];
  return newRequest;
}

export async function updateRequestStatus(
  id: string,
  status: ExportRequest['status'],
  quote?: { amount: number; currency: string; notes?: string }
): Promise<ExportRequest | undefined> {
  await delay(null, 500);
  store = store.map((r) =>
    r.id === id
      ? {
          ...r,
          status,
          updatedAt: new Date().toISOString(),
          ...(quote
            ? { quoteAmount: quote.amount, quoteCurrency: quote.currency, quoteNotes: quote.notes }
            : {}),
        }
      : r
  );
  return store.find((r) => r.id === id);
}
