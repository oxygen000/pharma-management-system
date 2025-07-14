"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "warehouse" | "pharmacy"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users
const demoUsers: User[] = [
  { id: "1", email: "admin@pharma.com", name: "Admin User", role: "admin" },
  { id: "2", email: "warehouse@pharma.com", name: "Warehouse Manager", role: "warehouse" },
  { id: "3", email: "pharmacy@pharma.com", name: "Pharmacy Staff", role: "pharmacy" },
]

const demoPasswords: Record<string, string> = {
  "admin@pharma.com": "admin123",
  "warehouse@pharma.com": "warehouse123",
  "pharmacy@pharma.com": "pharmacy123",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("pharma_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = demoUsers.find((u) => u.email === email)
    if (user && demoPasswords[email] === password) {
      setUser(user)
      localStorage.setItem("pharma_user", JSON.stringify(user))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("pharma_user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
