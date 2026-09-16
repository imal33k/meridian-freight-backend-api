import type { AppNotification } from '../types';
import { mockNotifications } from '../data/mockData';
import { delay } from './apiClient';

let store: AppNotification[] = [...mockNotifications];

export async function listNotifications(userId: string): Promise<AppNotification[]> {
  return delay(
    store.filter((n) => n.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  );
}

export async function markAsRead(id: string): Promise<void> {
  await delay(null, 200);
  store = store.map((n) => (n.id === id ? { ...n, read: true } : n));
}

export async function markAllAsRead(userId: string): Promise<void> {
  await delay(null, 300);
  store = store.map((n) => (n.userId === userId ? { ...n, read: true } : n));
}
