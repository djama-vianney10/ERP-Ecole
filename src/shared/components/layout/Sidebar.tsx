/**
 * Fichier : src/shared/components/layout/Sidebar.tsx
 * Rôle : Sidebar de navigation avec menu adapté au rôle
 * Architecture : Navigation responsive avec routes dynamiques selon le rôle
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  Calendar,
  ClipboardCheck,
  Settings,
  BarChart,
  Bell,
  UserCircle,
  School,
  CalendarDays,
} from 'lucide-react'
import { useAuth } from '@/shared/hooks/useAuth'
import { cn } from '@/shared/lib/utils'
import { UserRole } from '@prisma/client'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

// Navigation par rôle
const getNavigationByRole = (role: UserRole): NavItem[] => {
  switch (role) {
    case UserRole.ADMIN:
    case UserRole.PRINCIPAL:
      return [
        {
          label: 'Tableau de bord',
          href: '/dashboard',
          icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
          label: 'Utilisateurs',
          href: '/dashboard/users',
          icon: <Users className="w-5 h-5" />,
        },
        {
          label: 'Classes',
          href: '/dashboard/classes',
          icon: <School className="w-5 h-5" />,
        },
        {
          label: 'Événements',
          href: '/dashboard/events',
          icon: <CalendarDays className="w-5 h-5" />,
        },
        {
          label: 'Statistiques',
          href: '/dashboard/statistics',
          icon: <BarChart className="w-5 h-5" />,
        },
        {
          label: 'Paramètres',
          href: '/dashboard/settings',
          icon: <Settings className="w-5 h-5" />,
        },
      ]

    case UserRole.TEACHER:
      return [
        {
          label: 'Tableau de bord',
          href: '/dashboard',
          icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
          label: 'Mes Classes',
          href: '/teacher/classes',
          icon: <School className="w-5 h-5" />,
        },
        {
          label: 'Notes',
          href: '/teacher/grades',
          icon: <FileText className="w-5 h-5" />,
        },
        {
          label: 'Assiduité',
          href: '/teacher/attendance',
          icon: <ClipboardCheck className="w-5 h-5" />,
        },
        {
          label: 'Notifications',
          href: '/teacher/notifications',
          icon: <Bell className="w-5 h-5" />,
        },
      ]

    case UserRole.STUDENT:
      return [
        {
          label: 'Tableau de bord',
          href: '/dashboard',
          icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
          label: 'Mes Notes',
          href: '/student/grades',
          icon: <FileText className="w-5 h-5" />,
        },
        {
          label: 'Emploi du Temps',
          href: '/student/schedule',
          icon: <Calendar className="w-5 h-5" />,
        },
        {
          label: 'Assiduité',
          href: '/student/attendance',
          icon: <ClipboardCheck className="w-5 h-5" />,
        },
        {
          label: 'Notifications',
          href: '/student/notifications',
          icon: <Bell className="w-5 h-5" />,
        },
      ]

    case UserRole.PARENT:
      return [
        {
          label: 'Tableau de bord',
          href: '/dashboard',
          icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
          label: 'Mes Enfants',
          href: '/parent/children',
          icon: <GraduationCap className="w-5 h-5" />,
        },
        {
          label: 'Notifications',
          href: '/parent/notifications',
          icon: <Bell className="w-5 h-5" />,
        },
      ]

    default:
      return [
        {
          label: 'Tableau de bord',
          href: '/dashboard',
          icon: <LayoutDashboard className="w-5 h-5" />,
        },
      ]
  }
}

const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const { user } = useAuth()

  const navigation = user?.role ? getNavigationByRole(user.role) : []

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-neutral-200 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 h-16 border-b border-neutral-200">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-50 to-blue-900 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-neutral-900">GS Arhogninci</h1>
              <p className="text-xs text-neutral-500">Temple Du Savoir</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary-50 text-blue-700'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary-50 rounded-lg"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{item.icon}</span>
                  <span className="relative z-10">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Info */}
          {user && (
            <div className="p-4 border-t border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br bg-blue-900 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-neutral-500 capitalize">
                    {user.role.toLowerCase().replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-40">
        <nav className="flex items-center justify-around px-2 py-2">
          {navigation.slice(0, 5).map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all',
                  isActive
                    ? 'text-primary-700'
                    : 'text-neutral-600'
                )}
              >
                <span className={cn(
                  'p-2 rounded-lg transition-colors',
                  isActive ? 'bg-primary-50' : ''
                )}>
                  {item.icon}
                </span>
                <span className="truncate max-w-[60px]">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}

export default Sidebar