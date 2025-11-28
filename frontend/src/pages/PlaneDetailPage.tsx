import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchItem } from '../api/client'
import { ImageGallery } from '../components/common/ImageGallery'
import { LoadingState } from '../components/common/LoadingState'
import { ErrorState } from '../components/common/ErrorState'
import { BookingModal } from '../components/booking/BookingModal'
import type { PlaneClass } from '../types'

export const PlaneDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['plane', id],
    enabled: Boolean(id),
    queryFn: () => fetchItem<PlaneClass>(`/plane-classes/${id}/`),
  })

  if (isLoading) return <LoadingState message="Loading plane class..." />
  if (isError || !data) return <ErrorState message="Plane class not found." onRetry={() => refetch()} />

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <ImageGallery images={data.images} />
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-widest text-brand">Plane class</p>
          <h1 className="mt-2 text-3xl font-semibold text-brand">{data.class_name}</h1>
          <p className="mt-3 text-sm text-gray-600">{data.description}</p>
          <div className="mt-4 rounded-xl bg-brand/5 p-4 text-sm text-brand">
            <p>Starting rate: ${data.price}</p>
            {data.amenities && <p>{data.amenities}</p>}
          </div>
          <div className="mt-6">
            <BookingModal itemType="plane" itemId={data.id} triggerLabel="Request this flight experience" />
          </div>
        </div>
      </div>
    </div>
  )
}

