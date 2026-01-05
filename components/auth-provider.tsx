"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { getCurrentUser, logout as authLogout, type User } from "@/lib/auth-store"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  logout: () => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: () => {},
  refreshUser: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = () => {
    setUser(getCurrentUser())
  }

  useEffect(() => {
    refreshUser()
    setIsLoading(false)
  }, [])

  const logout = () => {
    authLogout()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, logout, refreshUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
