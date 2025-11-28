import { useMutation, useQuery } from '@tanstack/react-query'
import { FormEvent, useState } from 'react'
import { apiClient, fetchArray } from '../../api/client'
import { ImageType } from '../../types'

type Props = {
  onSelect: (imageId: number) => void
}

export const ImageUploader = ({ onSelect }: Props) => {
  const [title, setTitle] = useState('')
  const [externalUrl, setExternalUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const { data: images = [], refetch } = useQuery({
    queryKey: ['images'],
    queryFn: () => fetchArray<ImageType>('/images/'),
  })

  const mutation = useMutation({
    mutationFn: async () => {
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', title || file.name)
        const response = await apiClient.post('/images/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        return response.data
      }
      const response = await apiClient.post('/images/', { title, external_url: externalUrl })
      return response.data
    },
    onSuccess: (data) => {
      setTitle('')
      setExternalUrl('')
      setFile(null)
      refetch()
      onSelect(data.id)
    },
  })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    mutation.mutate()
  }

  return (
    <div className="rounded-2xl border border-dashed border-gray-300 p-4">
      <p className="text-sm font-semibold text-brand">Manage images</p>
      <form onSubmit={handleSubmit} className="mt-3 space-y-3">
        <input
          type="text"
          placeholder="Title"
          className="w-full rounded-lg border border-gray-200 p-2 text-sm"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <input
          type="url"
          placeholder="External image URL (optional)"
          className="w-full rounded-lg border border-gray-200 p-2 text-sm"
          value={externalUrl}
          onChange={(event) => setExternalUrl(event.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          className="w-full rounded-lg border border-gray-200 p-2 text-sm"
          onChange={(event) => setFile(event.target.files?.[0] || null)}
        />
        <button type="submit" className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white">
          {mutation.isLoading ? 'Uploading...' : 'Save image'}
        </button>
      </form>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {images.map((img) => (
          <button
            key={img.id}
            className="flex items-center gap-2 rounded-lg border border-gray-100 p-2 text-left text-sm hover:border-brand"
            onClick={() => onSelect(img.id)}
          >
            <img src={img.url} alt={img.title} className="h-10 w-10 rounded object-cover" />
            <span className="text-xs font-medium text-brand">#{img.id} {img.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

