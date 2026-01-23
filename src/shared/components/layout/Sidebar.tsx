/**
 * Fichier : src/shared/components/layout/Sidebar.tsx
 * Rôle : Sidebar de navigation avec menu adapté au rôle
 * Architecture : Navigation responsive avec permissions RBAC
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
} from 'lucide-react'
import { useAuth } from '@/shared/hooks/useAuth'
import { cn } from '@/shared/lib/utils'
import { UserRole } from '@prisma/client'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  roles: UserRole[]
}

const navigation: NavItem[] = [
  {
    label: 'Tableau de bord',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: [UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.ACADEMIC_HEAD, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT],
  },
  {
    label: 'Utilisateurs',
    href: '/dashboard/users',
    icon: <Users className="w-5 h-5" />,
    roles: [UserRole.ADMIN, UserRole.PRINCIPAL],
  },
  {
    label: 'Élèves',
    href: '/dashboard/students',
    icon: <GraduationCap className="w-5 h-5" />,
    roles: [UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.ACADEMIC_HEAD, UserRole.TEACHER],
  },
  {
    label: 'Classes',
    href: '/dashboard/classes',
    icon: <BookOpen className="w-5 h-5" />,
    roles: [UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.ACADEMIC_HEAD, UserRole.TEACHER],
  },
  {
    label: 'Notes',
    href: '/dashboard/grades',
    icon: <FileText className="w-5 h-5" />,
    roles: [UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT],
  },
  {
    label: 'Emploi du temps',
    href: '/dashboard/schedule',
    icon: <Calendar className="w-5 h-5" />,
    roles: [UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.ACADEMIC_HEAD, UserRole.TEACHER, UserRole.STUDENT],
  },
  {
    label: 'Assiduité',
    href: '/dashboard/attendance',
    icon: <ClipboardCheck className="w-5 h-5" />,
    roles: [UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.ACADEMIC_HEAD, UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT],
  },
  {
    label: 'Statistiques',
    href: '/dashboard/statistics',
    icon: <BarChart className="w-5 h-5" />,
    roles: [UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.ACADEMIC_HEAD],
  },
  {
    label: 'Paramètres',
    href: '/dashboard/settings',
    icon: <Settings className="w-5 h-5" />,
    roles: [UserRole.ADMIN, UserRole.PRINCIPAL],
  },
]

const Sidebar: React.FC = () => {
  const pathname = usePathname()
  const { user } = useAuth()

  const filteredNavigation = navigation.filter((item) =>
    user?.role && item.roles.includes(user.role)
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-neutral-200 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 h-16 border-b border-neutral-200">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div>
              <h1 className="font-bold text-neutral-900">ERP Scolaire</h1>
              <p className="text-xs text-neutral-500">Côte d'Ivoire</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
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
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {user.firstName} {user.lastName}
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
    </>
  )
}

export default Sidebar