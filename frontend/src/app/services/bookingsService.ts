import type { Booking } from '../types';
import { mockBookings } from '../data/mockData';
import { delay } from './apiClient';

let store: Booking[] = [...mockBookings];

export async function listBookings(): Promise<Booking[]> {
  return delay([...store].sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export type NewBookingPayload = Omit<Booking, 'id' | 'status' | 'createdAt'>;

export async function createBooking(payload: NewBookingPayload): Promise<Booking> {
  await delay(null, 800);
  const booking: Booking = {
    ...payload,
    id: `bkg-${Date.now()}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  store = [booking, ...store];
  return booking;
}

export async function updateBookingStatus(id: string, status: Booking['status']): Promise<Booking | undefined> {
  await delay(null, 400);
  store = store.map((b) => (b.id === id ? { ...b, status } : b));
  return store.find((b) => b.id === id);
}
