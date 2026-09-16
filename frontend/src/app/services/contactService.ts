import type { ContactMessage } from '../types';
import { mockContactMessages } from '../data/mockData';
import { delay } from './apiClient';

let store: ContactMessage[] = [...mockContactMessages];

export async function listMessages(): Promise<ContactMessage[]> {
  return delay([...store].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export type NewMessagePayload = Omit<ContactMessage, 'id' | 'status' | 'createdAt'>;

export async function sendMessage(payload: NewMessagePayload): Promise<ContactMessage> {
  await delay(null, 800);
  const message: ContactMessage = {
    ...payload,
    id: `msg-${Date.now()}`,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  store = [message, ...store];
  return message;
}

export async function updateMessageStatus(id: string, status: ContactMessage['status']): Promise<ContactMessage | undefined> {
  await delay(null, 300);
  store = store.map((m) => (m.id === id ? { ...m, status } : m));
  return store.find((m) => m.id === id);
}
