import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchItem } from '../api/client'
import { ImageGallery } from '../components/common/ImageGallery'
import { LoadingState } from '../components/common/LoadingState'
import { ErrorState } from '../components/common/ErrorState'
import { BookingModal } from '../components/booking/BookingModal'
import type { ResortPackage } from '../types'

export const ResortDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['resort', id],
    enabled: Boolean(id),
    queryFn: () => fetchItem<ResortPackage>(`/resorts/${id}/`),
  })

  if (isLoading) return <LoadingState message="Loading resort package..." />
  if (isError || !data) return <ErrorState message="Resort package not found." onRetry={() => refetch()} />

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <ImageGallery images={data.images} />
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-widest text-brand">Resort package</p>
          <h1 className="mt-2 text-3xl font-semibold text-brand">{data.title}</h1>
          <p className="mt-3 text-sm text-gray-600">{data.description}</p>
          <div className="mt-4 rounded-xl bg-brand/5 p-4 text-sm text-brand">
            <p>Starting rate: ${data.price}</p>
            {data.amenities && <p>{data.amenities}</p>}
          </div>
          <div className="mt-6">
            <BookingModal itemType="resort" itemId={data.id} triggerLabel="Request this package" />
          </div>
        </div>
      </div>
    </div>
  )
}

