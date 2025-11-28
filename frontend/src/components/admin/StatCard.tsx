type Props = {
  label: string
  value: string | number
  helper?: string
}

export const StatCard = ({ label, value, helper }: Props) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="mt-2 text-3xl font-semibold text-brand">{value}</p>
    {helper && <p className="text-xs text-gray-500">{helper}</p>}
  </div>
)

