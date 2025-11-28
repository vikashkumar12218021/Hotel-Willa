import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hotel_willa_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hotel_willa_token')
      localStorage.removeItem('hotel_willa_refresh')
    }
    return Promise.reject(error)
  },
)

const safeArray = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload
  if (payload && typeof payload === 'object' && 'results' in payload) {
    const results = (payload as { results?: unknown }).results
    return Array.isArray(results) ? results : []
  }
  return []
}

export const apiClient = {
  get: api.get,
  post: api.post,
  put: api.put,
  patch: api.patch,
  delete: api.delete,
}

export const fetchArray = async <T>(url: string, params?: Record<string, unknown>): Promise<T[]> => {
  const response = await api.get(url, { params })
  return safeArray<T>(response.data)
}

export const fetchItem = async <T>(url: string): Promise<T> => {
  const response = await api.get(url)
  return response.data
}

export const submitBooking = async (payload: {
  item_type: string
  item_id: number
  start_date: string
  end_date: string
  guests: number
  notes?: string
}) => {
  const response = await api.post('/bookings/', payload)
  return response.data
}

export const login = async (credentials: { username: string; password: string }) => {
  const response = await api.post('/auth/login/', credentials)
  return response.data
}

export const register = async (payload: {
  username: string
  email?: string
  password: string
  first_name?: string
  last_name?: string
}) => {
  const response = await api.post('/auth/register/', payload)
  return response.data
}

export const refreshToken = async (refresh: string) => {
  const response = await api.post('/auth/refresh/', { refresh })
  return response.data
}

export const fetchDashboard = async () => {
  const response = await api.get('/dashboard/')
  return response.data
}

