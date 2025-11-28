import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchItem } from '../api/client'
import { ImageGallery } from '../components/common/ImageGallery'
import { LoadingState } from '../components/common/LoadingState'
import { ErrorState } from '../components/common/ErrorState'
import { BookingModal } from '../components/booking/BookingModal'
import type { Room } from '../types'

export const RoomDetailPage = () => {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['room', id],
    enabled: Boolean(id),
    queryFn: () => fetchItem<Room>(`/rooms/${id}/`),
  })

  const amenities = useMemo(
    () => data?.amenities?.split(',').map((item) => item.trim()).filter(Boolean) ?? [],
    [data?.amenities],
  )

  if (isLoading) return <LoadingState message="Loading room..." />
  if (isError || !data) return <ErrorState message="Room not found." onRetry={() => refetch()} />

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <ImageGallery images={data.images} />
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-widest text-brand">{data.room_type_display}</p>
          <h1 className="mt-2 text-3xl font-semibold text-brand">Room {data.room_number}</h1>
          <p className="mt-3 text-sm text-gray-600">{data.description}</p>
          <div className="mt-4 rounded-xl bg-brand/5 p-4 text-sm text-brand">
            <p>Capacity: {data.capacity} guests</p>
            <p>Nightly rate: ${data.price_per_night}</p>
          </div>
          <div className="mt-6">
            <p className="text-sm font-semibold text-brand">Amenities</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
              {amenities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <BookingModal itemType="room" itemId={data.id} triggerLabel="Book this room" />
          </div>
        </div>
      </div>
    </div>
  )
}

