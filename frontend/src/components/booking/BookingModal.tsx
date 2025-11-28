import { Dialog } from '@headlessui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { submitBooking } from '../../api/client'
import { useAuth } from '../../context/AuthContext'

type Props = {
  itemType: 'room' | 'table' | 'resort' | 'plane'
  itemId: number
  triggerLabel?: string
}

export const BookingModal = ({ itemType, itemId, triggerLabel = 'Book this experience' }: Props) => {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [formState, setFormState] = useState({
    start_date: '',
    end_date: '',
    guests: 1,
    notes: '',
  })

  const mutation = useMutation({
    mutationFn: () => submitBooking({ item_type: itemType, item_id: itemId, ...formState }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      setOpen(false)
      setFormState({ start_date: '', end_date: '', guests: 1, notes: '' })
      alert('Booking submitted! Our concierge will confirm shortly.')
    },
    onError: (error: any) => {
      alert(error?.response?.data?.detail || 'Booking failed. Please adjust dates or try again.')
    },
  })

  const disabled = !formState.start_date || !formState.end_date || mutation.isLoading

  return (
    <>
      <button
        className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand/90"
        onClick={() => setOpen(true)}
        disabled={!user}
      >
        {user ? triggerLabel : 'Login to book'}
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center px-4">
          <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <Dialog.Title className="text-lg font-semibold text-brand">Booking details</Dialog.Title>
            <form
              className="mt-4 space-y-4"
              onSubmit={(event) => {
                event.preventDefault()
                mutation.mutate()
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-600">Start date</label>
                <input
                  required
                  type="date"
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2"
                  value={formState.start_date}
                  onChange={(event) => setFormState((prev) => ({ ...prev, start_date: event.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">End date</label>
                <input
                  required
                  type="date"
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2"
                  value={formState.end_date}
                  min={formState.start_date}
                  onChange={(event) => setFormState((prev) => ({ ...prev, end_date: event.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Guests</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2"
                  value={formState.guests}
                  onChange={(event) => setFormState((prev) => ({ ...prev, guests: Number(event.target.value) }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Notes (optional)</label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2"
                  rows={3}
                  value={formState.notes}
                  onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
                />
              </div>
              <button
                type="submit"
                disabled={disabled}
                className="w-full rounded-full bg-brand px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-brand/60"
              >
                {mutation.isLoading ? 'Sending...' : 'Submit booking'}
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}

