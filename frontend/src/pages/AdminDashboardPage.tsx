import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchDashboard } from '../api/client'
import { LoadingState } from '../components/common/LoadingState'
import { ErrorState } from '../components/common/ErrorState'
import { StatCard } from '../components/admin/StatCard'
import { ResourceManager } from '../components/admin/ResourceManager'
import { ImageUploader } from '../components/admin/ImageUploader'

const parseImageIds = (value: string) =>
  value
    .split(',')
    .map((id) => parseInt(id.trim(), 10))
    .filter((id) => !Number.isNaN(id))

export const AdminDashboardPage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
  })
  const [copiedImageId, setCopiedImageId] = useState<number | null>(null)

  if (isLoading) return <LoadingState message="Loading dashboard..." />
  if (isError || !data) return <ErrorState message="Failed to load dashboard data." onRetry={() => refetch()} />

  const resourceCards = [
    { label: 'Total rooms', value: data.total_rooms },
    { label: 'Total resort packages', value: data.total_resorts },
    { label: 'Total bookings', value: data.total_bookings },
    { label: 'Occupancy (30 days)', value: `${data.occupancy_rate}%` },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-widest text-brand">Admin dashboard</p>
        <h1 className="text-3xl font-semibold text-brand">Hotel Willa control center</h1>
      </header>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {resourceCards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} />
        ))}
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-brand">Recent bookings</h2>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            {data.recent_bookings?.length ? (
              data.recent_bookings.map((booking: any) => (
                <li key={booking.id} className="rounded-xl bg-brand/5 p-3">
                  <p className="font-semibold text-brand">
                    {booking.item_type} #{booking.item_id}
                  </p>
                  <p>
                    {booking.start_date} → {booking.end_date} • Guests: {booking.guests}
                  </p>
                  <p>Status: {booking.status}</p>
                </li>
              ))
            ) : (
              <li>No bookings yet.</li>
            )}
          </ul>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-brand">Image library</h2>
          <p className="text-sm text-gray-600">
            Upload local media or register external URLs. Click an image to copy its ID and paste it into the Image IDs
            field when creating a room, table, or package.
          </p>
          <ImageUploader
            onSelect={(imageId) => {
              setCopiedImageId(imageId)
              if (navigator?.clipboard) {
                navigator.clipboard.writeText(String(imageId)).catch(() => null)
              }
            }}
          />
          {copiedImageId && (
            <p className="mt-3 text-xs text-brand">Copied image ID #{copiedImageId} to clipboard.</p>
          )}
        </div>
      </section>

      <section className="mt-10 space-y-6">
        <ResourceManager
          title="Rooms"
          endpoint="/rooms/"
          fields={[
            { name: 'room_number', label: 'Room number' },
            {
              name: 'room_type',
              label: 'Room type',
              type: 'select',
              options: [
                { label: 'Single', value: 'single' },
                { label: 'Double', value: 'double' },
                { label: 'Suite', value: 'suite' },
                { label: 'Deluxe', value: 'deluxe' },
              ],
            },
            { name: 'price_per_night', label: 'Price per night', type: 'number' },
            { name: 'capacity', label: 'Capacity', type: 'number' },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'amenities', label: 'Amenities (comma separated)', type: 'textarea' },
            {
              name: 'image_ids',
              label: 'Image IDs',
              helper: 'Comma-separated IDs (copy from uploader above)',
              prefill: (item) => item.images?.map((img: any) => img.id).join(', ') || '',
            },
          ]}
          transform={(payload) => ({
            ...payload,
            price_per_night: Number(payload.price_per_night || 0),
            capacity: Number(payload.capacity || 1),
            image_ids: parseImageIds(payload.image_ids || ''),
          })}
        />

        <ResourceManager
          title="Tables"
          endpoint="/tables/"
          fields={[
            { name: 'name', label: 'Name' },
            { name: 'seats', label: 'Seats', type: 'number' },
            { name: 'price', label: 'Price', type: 'number' },
            {
              name: 'table_type',
              label: 'Table type',
              type: 'select',
              options: [
                { label: '2 seats', value: '2' },
                { label: '4 seats', value: '4' },
                { label: '8 seats', value: '8' },
              ],
            },
            { name: 'description', label: 'Description', type: 'textarea' },
            {
              name: 'image_ids',
              label: 'Image IDs',
              helper: 'Comma-separated IDs',
              prefill: (item) => item.images?.map((img: any) => img.id).join(', ') || '',
            },
          ]}
          transform={(payload) => ({
            ...payload,
            seats: Number(payload.seats || 0),
            price: Number(payload.price || 0),
            image_ids: parseImageIds(payload.image_ids || ''),
          })}
        />

        <ResourceManager
          title="Resort packages"
          endpoint="/resorts/"
          fields={[
            { name: 'title', label: 'Title' },
            { name: 'price', label: 'Price', type: 'number' },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'amenities', label: 'Amenities', type: 'textarea' },
            {
              name: 'image_ids',
              label: 'Image IDs',
              helper: 'Comma-separated IDs',
              prefill: (item) => item.images?.map((img: any) => img.id).join(', ') || '',
            },
          ]}
          transform={(payload) => ({
            ...payload,
            price: Number(payload.price || 0),
            image_ids: parseImageIds(payload.image_ids || ''),
          })}
        />

        <ResourceManager
          title="Plane classes"
          endpoint="/plane-classes/"
          fields={[
            {
              name: 'class_name',
              label: 'Class name',
              type: 'select',
              options: [
                { label: 'Economy', value: 'Economy' },
                { label: 'Business', value: 'Business' },
                { label: 'First', value: 'First' },
              ],
            },
            { name: 'price', label: 'Price', type: 'number' },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'amenities', label: 'Amenities', type: 'textarea' },
            {
              name: 'image_ids',
              label: 'Image IDs',
              helper: 'Comma-separated IDs',
              prefill: (item) => item.images?.map((img: any) => img.id).join(', ') || '',
            },
          ]}
          transform={(payload) => ({
            ...payload,
            price: Number(payload.price || 0),
            image_ids: parseImageIds(payload.image_ids || ''),
          })}
        />

        <ResourceManager
          title="Occasions"
          endpoint="/occasions/"
          fields={[
            { name: 'title', label: 'Title' },
            { name: 'description', label: 'Description', type: 'textarea' },
            { name: 'applicable_items', label: 'Applicable items (comma list)' },
            {
              name: 'image_ids',
              label: 'Image IDs',
              helper: 'Comma-separated IDs',
              prefill: (item) => item.images?.map((img: any) => img.id).join(', ') || '',
            },
          ]}
          transform={(payload) => ({
            ...payload,
            image_ids: parseImageIds(payload.image_ids || ''),
          })}
        />
      </section>
    </div>
  )
}

