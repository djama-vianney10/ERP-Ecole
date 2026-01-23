/**
 * Fichier : src/modules/notifications/components/NotificationBell.tsx
 * Rôle : Composant cloche de notifications avec badge compteur
 * Architecture : UI Component avec state management local
 */

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell } from 'lucide-react'
import { useNotifications } from '@/shared/hooks/useNotifications'
import { NotificationBadge } from '@/shared/components/ui/Badge'
import NotificationList from './NotificationList'
import { cn } from '@/shared/lib/utils'

interface NotificationBellProps {
  className?: string
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { unreadCount } = useNotifications()

  return (
    <div className="relative">
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative p-2 rounded-lg hover:bg-neutral-100 transition-colors',
          className
        )}
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-neutral-700" />
        <NotificationBadge count={unreadCount} />
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-96 max-h-[500px] overflow-hidden bg-white rounded-xl shadow-strong border border-neutral-200 z-50"
            >
              <NotificationList onClose={() => setIsOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationBell