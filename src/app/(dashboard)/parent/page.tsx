/**
 * Fichier : src/app/(dashboard)/parent/children/notification/page.tsx
 * Rôle : Page des notifications pour les parents
 * Architecture : Vue des notifications concernant les enfants
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  BookOpen,
  TrendingUp,
  Filter,
  Search,
  Eye,
  Trash2,
  ChevronDown
} from 'lucide-react'
import { Card, CardHeader } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import Button from '@/shared/components/ui/Button'
import { useAuth } from '@/shared/hooks/useAuth'

interface Notification {
  id: string
  type: 'NEW_GRADE' | 'ABSENCE_ALERT' | 'LATE_ALERT' | 'ANNOUNCEMENT' | 'REPORT_CARD_READY'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  title: string
  message: string
  studentName: string
  isRead: boolean
  createdAt: string
  metadata?: any
}

export default function ParentNotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChild, setSelectedChild] = useState<string>('all')

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/parent/notifications')
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/parent/notifications/${notificationId}/read`, {
        method: 'PATCH',
      })
      
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        )
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/parent/notifications/${notificationId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/parent/notifications/mark-all-read', {
        method: 'PATCH',
      })
      
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NEW_GRADE':
        return <BookOpen className="w-5 h-5" />
      case 'ABSENCE_ALERT':
        return <AlertCircle className="w-5 h-5" />
      case 'LATE_ALERT':
        return <AlertCircle className="w-5 h-5" />
      case 'ANNOUNCEMENT':
        return <Bell className="w-5 h-5" />
      case 'REPORT_CARD_READY':
        return <TrendingUp className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'URGENT' || priority === 'HIGH') {
      return 'bg-red-50 border-red-200 text-red-700'
    }
    
    switch (type) {
      case 'NEW_GRADE':
        return 'bg-blue-50 border-blue-200 text-blue-700'
      case 'ABSENCE_ALERT':
      case 'LATE_ALERT':
        return 'bg-orange-50 border-orange-200 text-orange-700'
      case 'ANNOUNCEMENT':
        return 'bg-purple-50 border-purple-200 text-purple-700'
      case 'REPORT_CARD_READY':
        return 'bg-green-50 border-green-200 text-green-700'
      default:
        return 'bg-neutral-50 border-neutral-200 text-neutral-700'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <Badge variant="error" size="sm">Urgent</Badge>
      case 'HIGH':
        return <Badge variant="warning" size="sm">Haute</Badge>
      case 'MEDIUM':
        return <Badge variant="info" size="sm">Moyenne</Badge>
      default:
        return <Badge variant="neutral" size="sm">Basse</Badge>
    }
  }

  // Filtrage des notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'unread' ? !notification.isRead :
      notification.isRead

    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.studentName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesChild = 
      selectedChild === 'all' || notification.studentName === selectedChild

    return matchesFilter && matchesSearch && matchesChild
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  // Liste unique des enfants
  const children = Array.from(new Set(notifications.map(n => n.studentName)))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Notifications
          </h1>
          <p className="text-neutral-600">
            Suivez l'activité de vos enfants en temps réel
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            onClick={markAllAsRead}
          >
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Total</p>
              <p className="text-3xl font-bold text-neutral-900">
                {notifications.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
              <Bell className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card hover padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Non lues</p>
              <p className="text-3xl font-bold text-orange-600">
                {unreadCount}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card hover padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Enfants</p>
              <p className="text-3xl font-bold text-secondary-600">
                {children.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-secondary-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card padding="lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher une notification..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Filter by Status */}
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="appearance-none px-4 py-2 pr-10 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="all">Toutes</option>
              <option value="unread">Non lues</option>
              <option value="read">Lues</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
          </div>

          {/* Filter by Child */}
          <div className="relative">
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="all">Tous les enfants</option>
              {children.map((child) => (
                <option key={child} value={child}>{child}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredNotifications.length === 0 ? (
            <Card padding="lg">
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-600 text-lg">
                  Aucune notification trouvée
                </p>
              </div>
            </Card>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  hover
                  padding="none"
                  className={`overflow-hidden border-l-4 ${
                    !notification.isRead ? 'bg-primary-50/30' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type, notification.priority)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-neutral-900">
                              {notification.title}
                            </h3>
                            {getPriorityBadge(notification.priority)}
                            {!notification.isRead && (
                              <Badge variant="primary" size="sm">Nouveau</Badge>
                            )}
                          </div>
                          <span className="text-sm text-neutral-500 whitespace-nowrap">
                            {new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        <p className="text-neutral-700 mb-3">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="neutral" size="sm">
                              {notification.studentName}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                leftIcon={<Eye className="w-4 h-4" />}
                                onClick={() => markAsRead(notification.id)}
                              >
                                Marquer comme lu
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              leftIcon={<Trash2 className="w-4 h-4" />}
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}