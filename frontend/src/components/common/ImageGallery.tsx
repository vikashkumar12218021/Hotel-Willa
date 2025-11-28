import { useState } from 'react'
import { ImageType } from '../../types'

export const ImageGallery = ({ images = [] }: { images?: ImageType[] }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  if (!images.length) {
    return null
  }
  const active = images[activeIndex]
  return (
    <div>
      <img
        src={active.url}
        alt={active.alt_text || active.title || 'Gallery image'}
        className="h-80 w-full rounded-2xl object-cover"
      />
      <div className="mt-3 flex gap-3 overflow-x-auto">
        {images.map((img, index) => (
          <button
            key={img.id}
            onClick={() => setActiveIndex(index)}
            className={`h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl border-2 ${
              activeIndex === index ? 'border-brand' : 'border-transparent'
            }`}
          >
            <img src={img.url} alt={img.alt_text || img.title || 'Gallery thumbnail'} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

