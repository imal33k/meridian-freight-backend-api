import type { Shipment, TrackingEvent, ShipmentDocument } from '../types';
import { allShipments } from '../data/mockData';
import { delay } from './apiClient';

let store: Shipment[] = [...allShipments];

export async function listShipmentsForCustomer(customerId: string): Promise<Shipment[]> {
  return delay(
    store.filter((s) => s.customerId === customerId).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  );
}

export async function listAllShipments(): Promise<Shipment[]> {
  return delay([...store].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
}

export async function getShipment(id: string): Promise<Shipment | undefined> {
  return delay(store.find((s) => s.id === id));
}

// Public tracking: looks up by external reference number only, and the
// caller is responsible for stripping this down to "safe" fields.
export async function trackByReference(reference: string): Promise<Shipment | undefined> {
  await delay(null, 600);
  return store.find((s) => s.reference.toLowerCase() === reference.trim().toLowerCase());
}

export async function addTrackingEvent(
  shipmentId: string,
  event: Omit<TrackingEvent, 'id' | 'shipmentId'>
): Promise<Shipment | undefined> {
  await delay(null, 500);
  store = store.map((s) =>
    s.id === shipmentId
      ? {
          ...s,
          currentLocation: `${event.status} — ${event.location}`,
          updatedAt: new Date().toISOString(),
          events: [...s.events, { ...event, id: `evt-${Date.now()}`, shipmentId }],
        }
      : s
  );
  return store.find((s) => s.id === shipmentId);
}

export async function updateShipmentStatus(shipmentId: string, status: Shipment['status']): Promise<Shipment | undefined> {
  await delay(null, 400);
  store = store.map((s) => (s.id === shipmentId ? { ...s, status, updatedAt: new Date().toISOString() } : s));
  return store.find((s) => s.id === shipmentId);
}

export async function addDocument(
  shipmentId: string,
  doc: Omit<ShipmentDocument, 'id' | 'shipmentId' | 'uploadedAt'>
): Promise<Shipment | undefined> {
  await delay(null, 500);
  store = store.map((s) =>
    s.id === shipmentId
      ? {
          ...s,
          documents: [
            ...s.documents,
            { ...doc, id: `doc-${Date.now()}`, shipmentId, uploadedAt: new Date().toISOString() },
          ],
        }
      : s
  );
  return store.find((s) => s.id === shipmentId);
}

export async function createShipmentFromRequest(params: {
  requestId: string;
  customerId: string;
  customerName: string;
  type: Shipment['type'];
  origin: string;
  destination: string;
  transportMethod: Shipment['transportMethod'];
  goodsDescription: string;
  weightKg: number;
  estimatedDelivery: string;
}): Promise<Shipment> {
  await delay(null, 600);
  const seq = 1300 + store.length + 1;
  const prefix = params.type === 'export' ? 'EXP' : 'IMP';
  const newShipment: Shipment = {
    id: `shp-${Date.now()}`,
    reference: `${prefix}-2026-${String(seq).padStart(6, '0')}`,
    requestId: params.requestId,
    customerId: params.customerId,
    customerName: params.customerName,
    type: params.type,
    origin: params.origin,
    destination: params.destination,
    currentLocation: 'Booking confirmed',
    transportMethod: params.transportMethod,
    status: 'booked',
    goodsDescription: params.goodsDescription,
    weightKg: params.weightKg,
    estimatedDelivery: params.estimatedDelivery,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    events: [
      {
        id: `evt-${Date.now()}`,
        shipmentId: `shp-${Date.now()}`,
        status: 'Booking confirmed',
        location: params.origin,
        description: 'Shipment created from accepted request.',
        timestamp: new Date().toISOString(),
      },
    ],
    documents: [],
  };
  store = [newShipment, ...store];
  return newShipment;
}
