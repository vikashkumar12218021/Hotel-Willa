import { FormEvent, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const redirectPath = (location.state as { from?: string } | undefined)?.from || '/'

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    try {
      await login(form)
      navigate(redirectPath, { replace: true })
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Login failed. Check your credentials.')
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm"
      >
        <p className="text-sm uppercase tracking-widest text-brand">Account</p>
        <h1 className="mt-2 text-3xl font-semibold text-brand">Sign in to Hotel Willa</h1>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
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
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

