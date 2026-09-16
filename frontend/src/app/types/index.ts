// Core domain types for the Import & Export Digital Platform.
// These mirror the data model described in the PRD (Section 19) and are
// intentionally shaped so a real backend can be substituted later without
// changing consuming components — see src/app/services for the abstraction.

export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  role: UserRole;
  createdAt: string;
  emailVerified: boolean;
}

export type TransportMethod = 'air' | 'sea' | 'land';
export type ShipmentType = 'import' | 'export';

export type RequestStatus =
  | 'pending'
  | 'under_review'
  | 'quote_provided'
  | 'accepted'
  | 'booked'
  | 'rejected'
  | 'cancelled'
  | 'on_hold';

export interface ExportRequest {
  id: string;
  reference: string; // e.g. REQ-2026-000412
  customerId: string;
  type: ShipmentType;
  origin: string;
  destination: string;
  goodsDescription: string;
  goodsType: string;
  quantity: string;
  weightKg: number;
  dimensions: string;
  transportMethod: TransportMethod;
  pickupAddress: string;
  deliveryAddress: string;
  additionalInfo?: string;
  status: RequestStatus;
  quoteAmount?: number;
  quoteCurrency?: string;
  quoteNotes?: string;
  createdAt: string;
  updatedAt: string;
  linkedShipmentId?: string;
}

export type ShipmentStatus =
  | 'booked'
  | 'shipment_created'
  | 'in_transit'
  | 'customs'
  | 'out_for_delivery'
  | 'delivered'
  | 'on_hold';

export interface TrackingEvent {
  id: string;
  shipmentId: string;
  status: string; // human label e.g. "Departed origin port"
  location: string;
  description: string;
  timestamp: string;
}

export interface ShipmentDocument {
  id: string;
  shipmentId: string;
  name: string;
  type: 'commercial_invoice' | 'packing_list' | 'bill_of_lading' | 'customs_document' | 'proof_of_delivery' | 'other';
  uploadedAt: string;
  sizeLabel: string;
  restricted: boolean;
}

export interface Shipment {
  id: string;
  reference: string; // internal tracking number e.g. EXP-2026-000001
  requestId?: string;
  customerId: string;
  customerName: string;
  type: ShipmentType;
  origin: string;
  destination: string;
  currentLocation: string;
  carrier?: string;
  transportMethod: TransportMethod;
  status: ShipmentStatus;
  goodsDescription: string;
  weightKg: number;
  containerNumber?: string;
  billOfLading?: string;
  airWaybill?: string;
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
  events: TrackingEvent[];
  documents: ShipmentDocument[];
}

export type NotificationType =
  | 'shipment_picked_up'
  | 'shipment_departed'
  | 'shipment_arrived'
  | 'customs_clearance'
  | 'shipment_delivered'
  | 'quote_ready'
  | 'request_update'
  | 'system';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  shipmentReference?: string;
  read: boolean;
  createdAt: string;
}

export type BookingReason =
  | 'export_consultation'
  | 'import_consultation'
  | 'freight_quote'
  | 'customs_support'
  | 'general_enquiry';

export interface Booking {
  id: string;
  reason: BookingReason;
  date: string;
  time: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  createdAt: string;
}

export interface Destination {
  id: string;
  country: string;
  region: string;
  port: string;
  services: TransportMethod[];
  leadTimeDays: string;
  summary: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
}
