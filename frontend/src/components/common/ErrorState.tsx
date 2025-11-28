type Props = {
  message: string
  onRetry?: () => void
}

export const ErrorState = ({ message, onRetry }: Props) => (
  <div className="rounded-xl bg-red-50 p-6 text-center text-red-700">
    <p className="font-semibold">{message}</p>
    {onRetry && (
      <button className="mt-3 text-sm font-medium text-brand underline" onClick={onRetry}>
        Try again
      </button>
    )}
  </div>
)

