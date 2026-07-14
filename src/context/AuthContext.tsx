import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchMe, logout as apiLogout, type AuthUser } from '@/lib/api'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (token: string, user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'cosmosedge-auth-token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    typeof window === 'undefined' ? null : window.localStorage.getItem(STORAGE_KEY),
  )
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }
    fetchMe(token)
      .then(({ user }) => setUser(user))
      .catch(() => {
        setToken(null)
        setUser(null)
        window.localStorage.removeItem(STORAGE_KEY)
      })
      .finally(() => setIsLoading(false))
  }, [token])

  const login = (newToken: string, newUser: AuthUser) => {
    window.localStorage.setItem(STORAGE_KEY, newToken)
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    if (token) apiLogout(token).catch(() => {})
    window.localStorage.removeItem(STORAGE_KEY)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
