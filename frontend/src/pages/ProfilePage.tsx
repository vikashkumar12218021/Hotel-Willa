import { useQuery } from '@tanstack/react-query'
import { fetchArray } from '../api/client'
import { LoadingState } from '../components/common/LoadingState'
import { ErrorState } from '../components/common/ErrorState'
import type { Booking } from '../types'

export const ProfilePage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['bookings', 'me'],
    queryFn: () => fetchArray<Booking>('/bookings/'),
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-widest text-brand">Your bookings</p>
        <h1 className="text-3xl font-semibold text-brand">Plan with Hotel Willa</h1>
      </header>

      {isLoading && <LoadingState message="Loading bookings..." />}
      {isError && <ErrorState message="Unable to load your bookings." onRetry={() => refetch()} />}

      <div className="mt-8 space-y-4">
        {data?.length ? (
          data.map((booking) => (
            <div key={booking.id} className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-sm uppercase tracking-widest text-brand">{booking.item_type}</p>
              <p className="text-lg font-semibold text-brand">
                #{booking.item_id} {booking.item_name && `· ${booking.item_name}`}
              </p>
              <p className="text-sm text-gray-600">
                {booking.start_date} → {booking.end_date} · Guests {booking.guests}
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-brand/70">Status: {booking.status}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">No bookings yet. Explore a room or experience to submit a request.</p>
        )}
      </div>
    </div>
  )
}

