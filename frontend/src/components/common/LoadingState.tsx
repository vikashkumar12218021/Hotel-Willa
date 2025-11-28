export const LoadingState = ({ message = 'Loading content…' }: { message?: string }) => (
  <div className="flex w-full justify-center py-16">
    <div className="animate-pulse rounded-full border-2 border-brand px-6 py-3 text-brand">{message}</div>
  </div>
)

