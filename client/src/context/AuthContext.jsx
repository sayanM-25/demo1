import {
  createContext,
  startTransition,
  useEffect,
  useState,
} from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'trustlytics-auth'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY))
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(localStorage.getItem(STORAGE_KEY)))

  useEffect(() => {
    if (!token) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }

    localStorage.setItem(STORAGE_KEY, token)
    let ignore = false

    api
      .me(token)
      .then((data) => {
        if (!ignore) {
          startTransition(() => {
            setUser(data.user)
            setIsLoading(false)
          })
        }
      })
      .catch(() => {
        if (!ignore) {
          localStorage.removeItem(STORAGE_KEY)
          startTransition(() => {
            setToken(null)
            setUser(null)
            setIsLoading(false)
          })
        }
      })

    return () => {
      ignore = true
    }
  }, [token])

  const value = {
    token,
    user,
    isLoading,
    async login(credentials) {
      setIsLoading(true)
      const data = await api.login(credentials)
      setIsLoading(false)
      setToken(data.token)
      setUser(data.user)
      return data
    },
    async register(payload) {
      setIsLoading(true)
      const data = await api.register(payload)
      setIsLoading(false)
      setToken(data.token)
      setUser(data.user)
      return data
    },
    logout() {
      localStorage.removeItem(STORAGE_KEY)
      setToken(null)
      setUser(null)
      setIsLoading(false)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }
