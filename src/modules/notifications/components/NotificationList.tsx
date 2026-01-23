/**
 * Fichier : src/modules/notifications/components/NotificationList.tsx
 * Rôle : Liste des notifications avec interactions
 * Architecture : Component avec gestion des états de lecture
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  AlertTriangle, 
  Clock, 
  Bell, 
  CheckCircle,
  X 
} from 'lucide-react'
import { useNotifications } from '@/shared/hooks/useNotifications'
import { Badge } from '@/shared/components/ui/Badge'
import Button from '@/shared/components/ui/Button'
import { formatRelativeDate, cn } from '@/shared/lib/utils'

interface NotificationListProps {
  onClose: () => void
}

const NotificationList: React.FC<NotificationListProps> = ({ onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isLoading } = useNotifications()

  const getIcon = (type: string) => {
    switch (type) {
      case 'NEW_GRADE':
        return <FileText className="w-5 h-5" />
      case 'ABSENCE_ALERT':
        return <AlertTriangle className="w-5 h-5" />
      case 'LATE_ALERT':
        return <Clock className="w-5 h-5" />
      case 'REPORT_CARD_READY':
        return <CheckCircle className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case 'NEW_GRADE':
        return 'text-blue-500 bg-blue-50'
      case 'ABSENCE_ALERT':
        return 'text-red-500 bg-red-50'
      case 'LATE_ALERT':
        return 'text-yellow-500 bg-yellow-50'
      case 'REPORT_CARD_READY':
        return 'text-green-500 bg-green-50'
      default:
        return 'text-neutral-500 bg-neutral-50'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <Badge variant="error" size="sm">Urgent</Badge>
      case 'HIGH':
        return <Badge variant="warning" size="sm">Important</Badge>
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div>
          <h3 className="font-semibold text-neutral-900">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-sm text-neutral-600">
              {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
            >
              Tout marquer comme lu
            </Button>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Bell className="w-12 h-12 text-neutral-300 mb-3" />
            <p className="text-neutral-600 text-center">
              Aucune notification
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'p-4 hover:bg-neutral-50 transition-colors cursor-pointer',
                  !notification.isRead && 'bg-primary-50/30'
                )}
                onClick={() => {
                  if (!notification.isRead) {
                    markAsRead(notification.id)
                  }
                }}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className={cn(
                    'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                    getIconColor(notification.type)
                  )}>
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={cn(
                        'text-sm font-medium',
                        notification.isRead ? 'text-neutral-700' : 'text-neutral-900'
                      )}>
                        {notification.title}
                      </h4>
                      {getPriorityBadge(notification.priority)}
                    </div>

                    <p className={cn(
                      'text-sm mb-2',
                      notification.isRead ? 'text-neutral-500' : 'text-neutral-700'
                    )}>
                      {notification.message}
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-400">
                        {formatRelativeDate(notification.createdAt)}
                      </span>
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-primary-500 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationList