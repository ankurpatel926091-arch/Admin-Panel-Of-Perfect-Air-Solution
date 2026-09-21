import React, { useMemo, useState } from 'react';
import { useDeleteBookingMutation, useGetBookingsQuery } from '@/store/api';
import { toast } from 'sonner';
import Loader from '@/components/ui/Loader';

const serviceLabelMap: Record<string, string> = {
  repair: 'AC Repair',
  installation: 'AC Installation',
  maintenance: 'AC Maintenance',
};

const formatDateTime = (value?: string) => {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const AdminBookings = () => {
  const { data: bookings = [], isLoading } = useGetBookingsQuery();
  const [deleteBooking] = useDeleteBookingMutation();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const sortedBookings = useMemo(
    () => [...bookings].sort((a: any, b: any) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime()),
    [bookings]
  );

  const handleDeleteConfirm = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteBooking(id).unwrap();
      toast.success('Booking deleted successfully');
    } catch {
      toast.error('Failed to delete booking');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-10">
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-neutral-400 mb-1">
          Booking Management
        </p>
        <h1 className="heading-1 text-neutral-900">Bookings</h1>
        <p className="text-neutral-500 mt-1 text-sm">
          {sortedBookings.length} {sortedBookings.length === 1 ? 'booking' : 'bookings'} received
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader />
          <p className="text-sm text-neutral-400 animate-pulse">Loading bookings...</p>
        </div>
      ) : sortedBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 rounded-md bg-neutral-100 border-2 border-dashed border-neutral-300 flex items-center justify-center mb-5">
            <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-700 mb-1">No bookings yet</h3>
          <p className="text-sm text-neutral-400 max-w-xs">
            New bookings from homepage form will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sortedBookings.map((booking: any) => {
            const id = booking?._id;
            const isDeleting = deletingId === id;
            const isConfirmingDelete = confirmDeleteId === id;
            const serviceKey = String(booking?.service || '');
            const serviceLabel = serviceLabelMap[serviceKey] || serviceKey || 'N/A';

            return (
              <div
                key={id}
                className="relative rounded-md border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{booking?.name || '-'}</p>
                    <p className="text-xs text-neutral-500">{formatDateTime(booking?.createdAt)}</p>
                  </div>
                  <span className="inline-flex items-center rounded-md bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                    {serviceLabel}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-neutral-700">
                    <span className="text-neutral-500">Email:</span> {booking?.email || '-'}
                  </p>
                  <p className="text-neutral-700">
                    <span className="text-neutral-500">Phone:</span> {booking?.phone || '-'}
                  </p>
                </div>

                {!isConfirmingDelete ? (
                  <button
                    onClick={() => setConfirmDeleteId(id)}
                    className="mt-4 w-full rounded-md border border-red-200 bg-red-50 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    Delete Booking
                  </button>
                ) : (
                  <div className="mt-4 rounded-md border border-neutral-200 bg-neutral-50 p-3">
                    <p className="text-xs font-medium text-neutral-700 mb-3">
                      Are you sure you want to delete this booking?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="flex-1 rounded-md border border-neutral-200 bg-white py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteConfirm(id)}
                        disabled={isDeleting}
                        className="flex-1 rounded-md bg-red-500 py-2 text-xs font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-60 cursor-pointer"
                      >
                        {isDeleting ? 'Deleting...' : 'Confirm'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
