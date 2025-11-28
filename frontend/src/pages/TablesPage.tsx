import { useQuery } from '@tanstack/react-query'
import { fetchArray } from '../api/client'
import { ResourceCard } from '../components/common/ResourceCard'
import { LoadingState } from '../components/common/LoadingState'
import { ErrorState } from '../components/common/ErrorState'
import type { TableType } from '../types'

export const TablesPage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['tables', 'list'],
    queryFn: () => fetchArray<TableType>('/tables/', { page_size: 20 }),
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-widest text-brand">Dining tables</p>
        <h1 className="text-3xl font-semibold text-brand">Reserve signature tables</h1>
        <p className="text-sm text-gray-600">
          From garden hideaways to chef-led counters, tables are configurable based on the celebration you have in mind.
        </p>
      </header>

      {isLoading && <LoadingState message="Loading tables..." />}
      {isError && <ErrorState message="Unable to load tables." onRetry={() => refetch()} />}

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((table) => (
          <ResourceCard
            key={table.id}
            title={table.name}
            description={table.description}
            priceLabel={`Seats ${table.seats} · $${table.price}`}
            href={`/tables/${table.id}`}
            images={table.images}
          />
        ))}
      </div>
    </div>
  )
}

