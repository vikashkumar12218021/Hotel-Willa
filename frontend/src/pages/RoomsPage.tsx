import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchArray } from '../api/client'
import { ResourceCard } from '../components/common/ResourceCard'
import { LoadingState } from '../components/common/LoadingState'
import { ErrorState } from '../components/common/ErrorState'
import type { Room } from '../types'

const roomFilters = [
  { label: 'All types', value: 'all' },
  { label: 'Single', value: 'single' },
  { label: 'Double', value: 'double' },
  { label: 'Suite', value: 'suite' },
  { label: 'Deluxe', value: 'deluxe' },
]

export const RoomsPage = () => {
  const [filter, setFilter] = useState('all')
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['rooms', 'list'],
    queryFn: () => fetchArray<Room>('/rooms/', { page_size: 50 }),
  })

  const rooms = useMemo(() => {
    if (!Array.isArray(data)) return []
    if (filter === 'all') return data
    return data.filter((room) => room.room_type === filter)
  }, [data, filter])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-widest text-brand">Rooms & suites</p>
        <h1 className="text-3xl font-semibold text-brand">Choose your Hotel Willa stay</h1>
        <p className="text-sm text-gray-600">
          Browse room styles with transparent pricing. Booking forms live in each detail view to keep the homepage
          clutter-free and purpose-driven.
        </p>
        <div className="flex flex-wrap gap-3">
          {roomFilters.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`rounded-full border px-3 py-1 text-sm ${
                filter === option.value ? 'border-brand bg-brand text-white' : 'border-gray-200 text-brand'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      {isLoading && <LoadingState message="Loading rooms..." />}
      {isError && <ErrorState message="Unable to load rooms." onRetry={() => refetch()} />}

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <ResourceCard
            key={room.id}
            title={`Room ${room.room_number}`}
            description={room.description}
            priceLabel={`From $${room.price_per_night} · Sleeps ${room.capacity}`}
            href={`/rooms/${room.id}`}
            images={room.images}
          />
        ))}
      </div>
    </div>
  )
}

