import { useQuery } from '@tanstack/react-query'
import { fetchArray } from '../api/client'
import { ResourceCard } from '../components/common/ResourceCard'
import { LoadingState } from '../components/common/LoadingState'
import { ErrorState } from '../components/common/ErrorState'
import type { ResortPackage } from '../types'

export const ResortsPage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['resorts', 'list'],
    queryFn: () => fetchArray<ResortPackage>('/resorts/', { page_size: 20 }),
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-widest text-brand">Resort packages</p>
        <h1 className="text-3xl font-semibold text-brand">Curated Hotel Willa itineraries</h1>
        <p className="text-sm text-gray-600">
          Longer stays with programming by day and signature dining by night. Each package has a booking form in the
          detail view to coordinate directly with the concierge.
        </p>
      </header>

      {isLoading && <LoadingState message="Loading resort packages..." />}
      {isError && <ErrorState message="Unable to load resort packages." onRetry={() => refetch()} />}

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((resort) => (
          <ResourceCard
            key={resort.id}
            title={resort.title}
            description={resort.description}
            priceLabel={`From $${resort.price}`}
            href={`/resorts/${resort.id}`}
            images={resort.images}
          />
        ))}
      </div>
    </div>
  )
}

