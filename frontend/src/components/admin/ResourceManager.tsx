import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { apiClient, fetchArray } from '../../api/client'
import { ErrorState } from '../common/ErrorState'
import { LoadingState } from '../common/LoadingState'

type FieldConfig = {
  name: string
  label: string
  type?: 'text' | 'number' | 'textarea' | 'select'
  options?: { label: string; value: string }[]
  placeholder?: string
  helper?: string
  prefill?: (item: Record<string, any>) => string
}

type ResourceManagerProps = {
  title: string
  endpoint: string
  fields: FieldConfig[]
  transform?: (data: Record<string, any>) => Record<string, any>
}

export const ResourceManager = ({ title, endpoint, fields, transform }: ResourceManagerProps) => {
  const initialState = useMemo(() => {
    const obj: Record<string, any> = {}
    fields.forEach((field) => {
      obj[field.name] = ''
    })
    return obj
  }, [fields])

  const [formValues, setFormValues] = useState(initialState)
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [endpoint],
    queryFn: () => fetchArray<Record<string, any>>(endpoint),
  })

  const mutation = useMutation({
    mutationFn: async (payload: Record<string, any>) => {
      const body = transform ? transform(payload) : payload
      if (editingId) {
        return apiClient.put(`${endpoint}${editingId}/`, body)
      }
      return apiClient.post(endpoint, body)
    },
    onSuccess: () => {
      setFormValues(initialState)
      setEditingId(null)
      refetch()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`${endpoint}${id}/`),
    onSuccess: () => refetch(),
  })

  if (isLoading) return <LoadingState message={`Loading ${title}...`} />
  if (error) return <ErrorState message={`Unable to load ${title}.`} onRetry={() => refetch()} />

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-brand">{title}</h3>
        {editingId && (
          <button
            className="text-sm text-red-500"
            onClick={() => {
              setEditingId(null)
              setFormValues(initialState)
            }}
          >
            Cancel edit
          </button>
        )}
      </div>
      <form
        className="mt-4 grid gap-4 md:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault()
          mutation.mutate(formValues)
        }}
      >
        {fields.map((field) => {
          let element = null
          if (field.type === 'textarea') {
            element = (
              <textarea
                className="mt-1 w-full rounded-lg border border-gray-200 p-2"
                rows={3}
                value={formValues[field.name]}
                onChange={(event) => setFormValues((prev) => ({ ...prev, [field.name]: event.target.value }))}
                placeholder={field.placeholder}
              />
            )
          } else if (field.type === 'select' && field.options) {
            element = (
              <select
                className="mt-1 w-full rounded-lg border border-gray-200 p-2"
                value={formValues[field.name]}
                onChange={(event) => setFormValues((prev) => ({ ...prev, [field.name]: event.target.value }))}
              >
                <option value="">Select</option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )
          } else {
            element = (
              <input
                type={field.type || 'text'}
                className="mt-1 w-full rounded-lg border border-gray-200 p-2"
                value={formValues[field.name]}
                onChange={(event) => setFormValues((prev) => ({ ...prev, [field.name]: event.target.value }))}
                placeholder={field.placeholder}
              />
            )
          }
          return (
            <label key={field.name} className="text-sm font-medium text-gray-600">
              {field.label}
              {element}
              {field.helper && <span className="mt-1 block text-xs font-normal text-gray-500">{field.helper}</span>}
            </label>
          )
        })}
        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white disabled:bg-brand/60"
            disabled={mutation.isLoading}
          >
            {editingId ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            className="rounded-full border border-gray-300 px-4 py-2 text-sm"
            onClick={() => setFormValues(initialState)}
          >
            Clear
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {data?.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-3">
            <div>
              <p className="font-semibold text-brand">{item.title || item.name || item.room_number}</p>
              <p className="text-sm text-gray-500">#{item.id}</p>
            </div>
            <div className="flex gap-3">
              <button
                className="text-sm text-brand"
                onClick={() => {
                  setEditingId(item.id)
                  setFormValues(
                    fields.reduce((acc, field) => {
                      const value = field.prefill ? field.prefill(item) : item[field.name]
                      return {
                        ...acc,
                        [field.name]: value ?? '',
                      }
                    }, {}),
                  )
                }}
              >
                Edit
              </button>
              <button className="text-sm text-red-500" onClick={() => deleteMutation.mutate(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

