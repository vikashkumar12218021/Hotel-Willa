import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../api/client'

export const RegisterPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)
    try {
      await register(form)
      setSuccess('Account created. You can sign in now.')
      setTimeout(() => navigate('/login'), 800)
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm"
      >
        <p className="text-sm uppercase tracking-widest text-brand">Create account</p>
        <h1 className="mt-2 text-3xl font-semibold text-brand">Join Hotel Willa</h1>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {success && <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700">{success}</p>}
        <label className="mt-6 block text-sm font-medium text-gray-600">
          Username
          <input
            type="text"
            required
            className="mt-1 w-full rounded-xl border border-gray-200 p-3"
            value={form.username}
            onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-gray-600">
          Email
          <input
            type="email"
            className="mt-1 w-full rounded-xl border border-gray-200 p-3"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
        </label>
        <label className="mt-4 block text-sm font-medium text-gray-600">
          Password
          <input
            type="password"
            required
            className="mt-1 w-full rounded-xl border border-gray-200 p-3"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />
        </label>
        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-brand px-4 py-2 text-white disabled:bg-brand/70"
          disabled={submitting}
        >
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </div>
  )
}

