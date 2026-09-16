import { useEffect, useState } from 'react';
import { CalendarClock, Check, X } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Spinner from '../../components/shared/Spinner';
import EmptyState from '../../components/shared/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import * as bookingsService from '../../services/bookingsService';
import type { Booking } from '../../types';
import { formatDate } from '../../utils/format';

const reasonLabels: Record<string, string> = {
  export_consultation: 'Export consultation',
  import_consultation: 'Import consultation',
  freight_quote: 'Freight quote',
  customs_support: 'Customs & documentation support',
  general_enquiry: 'General enquiry',
};

function statusTone(status: Booking['status']) {
  if (status === 'confirmed') return 'success' as const;
  if (status === 'cancelled') return 'danger' as const;
  return 'warning' as const;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    bookingsService.listBookings().then(setBookings);
  }, []);

  async function updateStatus(id: string, status: Booking['status']) {
    setBusyId(id);
    await bookingsService.updateBookingStatus(id, status);
    const all = await bookingsService.listBookings();
    setBookings(all);
    setBusyId(null);
  }

  return (
    <div className="p-6 lg:p-10">
      <PageHeader title="Call bookings" description="Manage consultation calls booked through the public website." />

      {!bookings ? (
        <Spinner label="Loading bookings" />
      ) : bookings.length === 0 ? (
        <EmptyState icon={<CalendarClock size={20} />} title="No bookings yet" description="Bookings from the public site will appear here." />
      ) : (
        <div className="overflow-hidden rounded-sm border border-line bg-white">
          <ul className="divide-y divide-line">
            {bookings.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <p className="text-[15px] font-medium text-ink">{b.fullName}</p>
                    <StatusBadge label={b.status} tone={statusTone(b.status)} />
                  </div>
                  <p className="text-sm text-ink-mid">{reasonLabels[b.reason]} · {b.company ?? 'No company given'}</p>
                  <p className="text-xs text-ink-mid">
                    {formatDate(b.date)} at {b.time} · {b.email} · {b.phone}
                  </p>
                  {b.notes && <p className="mt-1 max-w-md text-xs text-ink-mid">"{b.notes}"</p>}
                </div>
                {b.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      disabled={busyId === b.id}
                      onClick={() => updateStatus(b.id, 'confirmed')}
                      className="flex items-center gap-1.5 rounded-sm border border-success/30 bg-success/5 px-3 py-1.5 text-xs font-medium text-success hover:bg-success/10"
                    >
                      <Check size={13} /> Confirm
                    </button>
                    <button
                      disabled={busyId === b.id}
                      onClick={() => updateStatus(b.id, 'cancelled')}
                      className="flex items-center gap-1.5 rounded-sm border border-danger/30 bg-danger/5 px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/10"
                    >
                      <X size={13} /> Cancel
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
