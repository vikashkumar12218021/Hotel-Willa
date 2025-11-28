import { useQuery } from '@tanstack/react-query'
import { fetchArray } from '../api/client'
import { LoadingState } from '../components/common/LoadingState'
import { ErrorState } from '../components/common/ErrorState'
import type { Occasion } from '../types'

export const OccasionsPage = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['occasions', 'list'],
    queryFn: () => fetchArray<Occasion>('/occasions/', { page_size: 20 }),
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-widest text-brand">Occasions</p>
        <h1 className="text-3xl font-semibold text-brand">Storyboard your event</h1>
        <p className="text-sm text-gray-600">
          Each occasion includes inspiration for which rooms, resort packages, or dining tables pair best with the
          atmosphere you are creating.
        </p>
      </header>

      {isLoading && <LoadingState message="Loading occasions..." />}
      {isError && <ErrorState message="Unable to load occasions." onRetry={() => refetch()} />}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {data?.map((occasion) => (
          <div key={occasion.id} className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xl font-semibold text-brand">{occasion.title}</p>
            <p className="mt-2 text-sm text-gray-600">{occasion.description}</p>
            {occasion.applicable_items && (
              <p className="mt-4 text-xs uppercase tracking-widest text-brand/70">
                Works well with: {occasion.applicable_items}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

