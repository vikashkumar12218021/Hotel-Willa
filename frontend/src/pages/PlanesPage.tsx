import { useQuery } from '@tanstack/react-query'
import { fetchArray } from '../api/client'
import { ResourceCard } from '../components/common/ResourceCard'
import { LoadingState } from '../components/common/LoadingState'
import { ErrorState } from '../components/common/ErrorState'
import type { PlaneClass } from '../types'

export const PlanesPage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['plane-classes', 'list'],
    queryFn: () => fetchArray<PlaneClass>('/plane-classes/'),
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-widest text-brand">Plane classes</p>
        <h1 className="text-3xl font-semibold text-brand">Curated air travel pairings</h1>
        <p className="text-sm text-gray-600">
          Hotel Willa coordinates premium plane classes to keep the full journey consistent from door to destination.
        </p>
      </header>

      {isLoading && <LoadingState message="Loading plane classes..." />}
      {isError && <ErrorState message="Failed to load plane classes." onRetry={() => refetch()} />}

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((plane) => (
          <ResourceCard
            key={plane.id}
            title={plane.class_name}
            description={plane.description}
            priceLabel={`From $${plane.price}`}
            href={`/planes/${plane.id}`}
            images={plane.images}
          />
        ))}
      </div>
    </div>
  )
}

