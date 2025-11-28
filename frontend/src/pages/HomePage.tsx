import { type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchArray } from '../api/client'
import { ResourceCard } from '../components/common/ResourceCard'
import { ErrorState } from '../components/common/ErrorState'
import { LoadingState } from '../components/common/LoadingState'
import type { Occasion, PlaneClass, ResortPackage, Room, TableType } from '../types'

const Section = ({
  title,
  description,
  href,
  children,
}: {
  title: string
  description: string
  href: string
  children: ReactNode
}) => (
  <section className="mx-auto mt-12 max-w-6xl px-4">
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-brand">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <Link to={href} className="text-sm font-semibold text-brand hover:underline">
        View all
      </Link>
    </div>
    <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  </section>
)

export const HomePage = () => {
  const roomsQuery = useQuery({
    queryKey: ['rooms', 'home'],
    queryFn: () => fetchArray<Room>('/rooms/', { page_size: 3 }),
  })
  const tablesQuery = useQuery({
    queryKey: ['tables', 'home'],
    queryFn: () => fetchArray<TableType>('/tables/', { page_size: 3 }),
  })
  const resortsQuery = useQuery({
    queryKey: ['resorts', 'home'],
    queryFn: () => fetchArray<ResortPackage>('/resorts/', { page_size: 3 }),
  })
  const planesQuery = useQuery({
    queryKey: ['planes', 'home'],
    queryFn: () => fetchArray<PlaneClass>('/plane-classes/'),
  })
  const occasionsQuery = useQuery({
    queryKey: ['occasions', 'home'],
    queryFn: () => fetchArray<Occasion>('/occasions/', { page_size: 4 }),
  })

  return (
    <div className="pb-16">
      <section className="bg-gradient-to-b from-brand/10 to-transparent">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 md:flex-row md:items-center">
          <div className="flex-1 space-y-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand">Welcome to Hotel Willa</p>
            <h1 className="text-4xl font-semibold text-brand">
              Modern hospitality rooted in calm, coastal energy.
            </h1>
            <p className="text-base text-gray-600 md:text-lg">
              Discover suites, dining, journeys, and curated occasions fully managed by the Hotel Willa concierge team.
              Every experience begins with a personalized consultation—start by exploring a space that inspires you.
            </p>
            <div className="flex gap-3">
              <Link to="/rooms" className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white">
                Explore rooms
              </Link>
              <Link to="/resorts" className="rounded-full border border-brand px-6 py-2 text-sm font-semibold text-brand">
                View resort escapes
              </Link>
            </div>
          </div>
          <div className="flex-1 rounded-3xl bg-white p-6 shadow-lg">
            <p className="text-sm uppercase tracking-wide text-gray-500">Hotel snapshot</p>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>• 8 signature room categories curated for different stays</li>
              <li>• Dining tables configured for intimate to celebratory gatherings</li>
              <li>• Resort itineraries blending wellness, adventure, and family time</li>
              <li>• Plane classes coordinated with our travel concierge</li>
              <li>• Occasion stylists for weddings, retreats, and milestone moments</li>
            </ul>
          </div>
        </div>
      </section>

      <Section title="Rooms" description="Quiet suites and residences designed for each travel style." href="/rooms">
        {roomsQuery.isLoading && <LoadingState message="Loading rooms..." />}
        {roomsQuery.isError && (
          <ErrorState message="Failed to load rooms." onRetry={() => roomsQuery.refetch()} />
        )}
        {roomsQuery.data?.map((room) => (
          <ResourceCard
            key={room.id}
            title={`Room ${room.room_number}`}
            description={room.description}
            priceLabel={`From $${room.price_per_night} per night`}
            href={`/rooms/${room.id}`}
            images={room.images}
          />
        ))}
      </Section>

      <Section title="Tables" description="Book curated dining layouts within Hotel Willa." href="/tables">
        {tablesQuery.isLoading && <LoadingState message="Loading tables..." />}
        {tablesQuery.isError && (
          <ErrorState message="Failed to load tables." onRetry={() => tablesQuery.refetch()} />
        )}
        {tablesQuery.data?.map((table) => (
          <ResourceCard
            key={table.id}
            title={table.name}
            description={table.description}
            priceLabel={`Seats ${table.seats} · $${table.price}`}
            href={`/tables/${table.id}`}
            images={table.images}
          />
        ))}
      </Section>

      <Section
        title="Resorts"
        description="Extended stays and themed itineraries for immersive escapes."
        href="/resorts"
      >
        {resortsQuery.isLoading && <LoadingState message="Loading resort packages..." />}
        {resortsQuery.isError && (
          <ErrorState message="Failed to load resorts." onRetry={() => resortsQuery.refetch()} />
        )}
        {resortsQuery.data?.map((resort) => (
          <ResourceCard
            key={resort.id}
            title={resort.title}
            description={resort.description}
            priceLabel={`Package from $${resort.price}`}
            href={`/resorts/${resort.id}`}
            images={resort.images}
          />
        ))}
      </Section>

      <Section
        title="Planes"
        description="Dedicated plane classes coordinated with Hotel Willa journeys."
        href="/planes"
      >
        {planesQuery.isLoading && <LoadingState message="Loading plane classes..." />}
        {planesQuery.isError && (
          <ErrorState message="Failed to load plane classes." onRetry={() => planesQuery.refetch()} />
        )}
        {planesQuery.data?.map((plane) => (
          <ResourceCard
            key={plane.id}
            title={plane.class_name}
            description={plane.description}
            priceLabel={`From $${plane.price}`}
            href={`/planes/${plane.id}`}
            images={plane.images}
          />
        ))}
      </Section>

      <section className="mx-auto mt-12 max-w-6xl px-4">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-brand">Occasions at Hotel Willa</h2>
          <p className="mt-2 text-sm text-gray-600">
            Browse inspiration for celebrations, retreats, and signature milestones. Our stylists will pair you with the
            right combination of rooms, tables, and resort experiences.
          </p>
          {occasionsQuery.isLoading && <LoadingState message="Loading occasions..." />}
          {occasionsQuery.isError && (
            <ErrorState message="Failed to load occasions." onRetry={() => occasionsQuery.refetch()} />
          )}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {occasionsQuery.data?.map((occasion) => (
              <div key={occasion.id} className="rounded-2xl border border-gray-100 p-4">
                <p className="text-lg font-semibold text-brand">{occasion.title}</p>
                <p className="text-sm text-gray-600">{occasion.description}</p>
              </div>
            ))}
          </div>
          <Link to="/occasions" className="mt-4 inline-flex text-sm font-semibold text-brand hover:underline">
            Explore all occasions
          </Link>
        </div>
      </section>
    </div>
  )
}

