import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchItem } from '../api/client'
import { ImageGallery } from '../components/common/ImageGallery'
import { LoadingState } from '../components/common/LoadingState'
import { ErrorState } from '../components/common/ErrorState'
import { BookingModal } from '../components/booking/BookingModal'
import type { TableType } from '../types'

export const TableDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['table', id],
    enabled: Boolean(id),
    queryFn: () => fetchItem<TableType>(`/tables/${id}/`),
  })

  if (isLoading) return <LoadingState message="Loading table..." />
  if (isError || !data) return <ErrorState message="Table not found." onRetry={() => refetch()} />

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <ImageGallery images={data.images} />
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-widest text-brand">Table experience</p>
          <h1 className="mt-2 text-3xl font-semibold text-brand">{data.name}</h1>
          <p className="mt-3 text-sm text-gray-600">{data.description}</p>
          <div className="mt-4 rounded-xl bg-brand/5 p-4 text-sm text-brand">
            <p>Seats: {data.seats} guests</p>
            <p>Experience rate: ${data.price}</p>
            <p>Table type: {data.table_type}</p>
          </div>
          <div className="mt-6">
            <BookingModal itemType="table" itemId={data.id} triggerLabel="Reserve this table" />
          </div>
        </div>
      </div>
    </div>
  )
}

