import { Buffer } from 'buffer'
import { createContext, ReactNode, useContext, useMemo, useState } from 'react'
import { login as loginRequest } from '../api/client'

type AuthUser = {
  username: string
  email?: string
  isStaff?: boolean
}

type AuthContextType = {
  user: AuthUser | null
  accessToken: string | null
  loading: boolean
  login: (credentials: { username: string; password: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const decodeSegment = (segment: string) => {
  try {
    if (typeof window !== 'undefined' && window.atob) {
      return window.atob(segment)
    }
    return Buffer.from(segment, 'base64').toString('binary')
  } catch {
    return ''
  }
}

const decodeToken = (token?: string): AuthUser | null => {
  if (!token) return null
  try {
    const [, payloadSegment] = token.split('.')
    const payload = JSON.parse(decodeSegment(payloadSegment))
    return {
      username: payload?.username ?? payload?.user,
      email: payload?.email,
      isStaff: payload?.is_staff || payload?.isStaff,
    }
  } catch (error) {
    console.error('Failed to decode token', error)
    return null
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const storageAvailable = typeof window !== 'undefined'
  const storedToken = storageAvailable ? localStorage.getItem('hotel_willa_token') : null
  const storedRefresh = storageAvailable ? localStorage.getItem('hotel_willa_refresh') : null

  const [accessToken, setAccessToken] = useState<string | null>(storedToken)
  const [refresh, setRefresh] = useState<string | null>(storedRefresh)
  const [user, setUser] = useState<AuthUser | null>(decodeToken(accessToken || undefined))
  const [loading, setLoading] = useState(false)

  const login = async (credentials: { username: string; password: string }) => {
    setLoading(true)
    try {
      const data = await loginRequest(credentials)
      setAccessToken(data.access)
      setRefresh(data.refresh)
      if (storageAvailable) {
        localStorage.setItem('hotel_willa_token', data.access)
        localStorage.setItem('hotel_willa_refresh', data.refresh)
      }
      setUser(decodeToken(data.access))
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    if (storageAvailable) {
      localStorage.removeItem('hotel_willa_token')
      localStorage.removeItem('hotel_willa_refresh')
    }
    setAccessToken(null)
    setRefresh(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      accessToken,
      login,
      logout,
      loading,
    }),
    [user, accessToken, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

