/**
 * Fichier : src/shared/components/layout/Header.tsx
 * Rôle : Header avec notifications et menu utilisateur
 * Architecture : Top bar avec actions utilisateur
 */

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, User, Settings } from 'lucide-react'
import { useAuth } from '@/shared/hooks/useAuth'
import NotificationBell from '@/modules/notifications/components/NotificationBell'
import { cn } from '@/shared/lib/utils'

const Header: React.FC = () => {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-neutral-200 h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* Titre de page (optionnel) */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-neutral-900">
            Bienvenue, {user?.firstName || 'Utilisateur'}
          </h2>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <NotificationBell />

          {/* User Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br bg-blue-900 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <span className="text-sm font-medium text-neutral-700 hidden sm:inline">
                {user?.firstName} {user?.lastName}
              </span>
            </motion.button>

            {/* Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-strong border border-neutral-200 overflow-hidden z-50"
                  >
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-neutral-100">
                      <p className="text-sm font-medium text-neutral-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-neutral-500">{user?.email}</p>
                      <p className="text-xs text-primary-600 mt-1 capitalize">
                        {user?.role.toLowerCase().replace('_', ' ')}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          router.push('/dashboard/profile')
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Mon profil
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          router.push('/dashboard/settings')
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Paramètres
                      </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-neutral-100 py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header