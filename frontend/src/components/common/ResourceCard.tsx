import { Link } from 'react-router-dom'
import { ImageType } from '../../types'

type Props = {
  title: string
  description: string
  priceLabel?: string
  href: string
  images?: ImageType[]
}

export const ResourceCard = ({ title, description, priceLabel, href, images }: Props) => {
  const image = images?.[0]?.url
  return (
    <Link
      to={href}
      className="flex flex-col rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      {image && (
        <img src={image} alt={title} className="h-48 w-full rounded-t-2xl object-cover" loading="lazy" decoding="async" />
      )}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-lg font-semibold text-brand">{title}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        {priceLabel && <p className="text-sm font-medium text-brand-accent">{priceLabel}</p>}
        <span className="text-sm font-semibold text-brand">View details →</span>
      </div>
    </Link>
  )
}

