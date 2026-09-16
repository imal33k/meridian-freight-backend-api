import type { RequestStatus, ShipmentStatus } from '../types';

export const requestStatusLabels: Record<RequestStatus, string> = {
  pending: 'Pending review',
  under_review: 'Under review',
  quote_provided: 'Quote provided',
  accepted: 'Accepted',
  booked: 'Booked',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  on_hold: 'On hold',
};

export const shipmentStatusLabels: Record<ShipmentStatus, string> = {
  booked: 'Booked',
  shipment_created: 'Shipment created',
  in_transit: 'In transit',
  customs: 'Customs clearance',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  on_hold: 'On hold',
};

export type StatusTone = 'neutral' | 'progress' | 'success' | 'warning' | 'danger';

export function requestStatusTone(status: RequestStatus): StatusTone {
  switch (status) {
    case 'pending':
    case 'under_review':
      return 'neutral';
    case 'quote_provided':
      return 'warning';
    case 'accepted':
    case 'booked':
      return 'progress';
    case 'rejected':
    case 'cancelled':
      return 'danger';
    case 'on_hold':
      return 'warning';
    default:
      return 'neutral';
  }
}

export function shipmentStatusTone(status: ShipmentStatus): StatusTone {
  switch (status) {
    case 'booked':
    case 'shipment_created':
      return 'neutral';
    case 'in_transit':
    case 'customs':
    case 'out_for_delivery':
      return 'progress';
    case 'delivered':
      return 'success';
    case 'on_hold':
      return 'warning';
    default:
      return 'neutral';
  }
}

// Ordered pipeline used to render progress bars / steppers.
export const shipmentPipeline: ShipmentStatus[] = [
  'booked',
  'shipment_created',
  'in_transit',
  'customs',
  'out_for_delivery',
  'delivered',
];
