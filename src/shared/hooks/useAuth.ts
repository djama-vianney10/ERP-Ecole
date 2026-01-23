/**
 * Fichier : src/shared/hooks/useAuth.ts
 * Rôle : Hook personnalisé pour la gestion de l'authentification côté client
 * Architecture : State management + LocalStorage pour persistence
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { AuthUser, LoginCredentials } from '@/modules/auth/types/auth.types'

interface UseAuthReturn {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshUser: () => Promise<void>
}

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Charger les données depuis localStorage au montage
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedUser = localStorage.getItem(USER_KEY)

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }

    setIsLoading(false)
  }, [])

  // Login
  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (data.success && data.user && data.token) {
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem(TOKEN_KEY, data.token)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
        return { success: true }
      }

      return { success: false, error: data.error || 'Échec de la connexion' }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Erreur réseau' }
    }
  }, [])

  // Logout
  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }, [])

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!token) return

    try {
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
      } else {
        logout()
      }
    } catch (error) {
      console.error('Refresh user error:', error)
    }
  }, [token, logout])

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    refreshUser,
  }
}