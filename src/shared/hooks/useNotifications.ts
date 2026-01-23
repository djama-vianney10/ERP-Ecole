/**
 * Fichier : src/shared/hooks/useNotifications.ts
 * Rôle : Hook pour la gestion temps réel des notifications
 * Architecture : Polling + State management
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'

interface Notification {
  id: string
  type: string
  priority: string
  title: string
  message: string
  metadata?: any
  isRead: boolean
  createdAt: string
}

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refresh: () => Promise<void>
}

export function useNotifications(): UseNotificationsReturn {
  const { token, isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!token || !isAuthenticated) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [token, isAuthenticated])

  // Marquer comme lu
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!token) return

    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif
          )
        )
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [token])

  // Marquer tout comme lu
  const markAllAsRead = useCallback(async () => {
    if (!token) return

    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, isRead: true }))
        )
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }, [token])

  // Polling toutes les 30 secondes
  useEffect(() => {
    if (!isAuthenticated) return

    fetchNotifications()

    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated, fetchNotifications])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  }
}