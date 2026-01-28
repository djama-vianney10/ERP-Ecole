/**
 * Fichier : src/app/(dashboard)/dashboard/page.tsx
 * Rôle : Page d'accueil du dashboard avec widgets contextuels
 * Architecture : Vue adaptative selon le rôle utilisateur
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp,
  Calendar,
  Award,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '@/shared/hooks/useAuth'
import { Card, CardHeader } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import { UserRole } from '@prisma/client'

// Composant Stat Card
const StatCard: React.FC<{
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: { value: number; isPositive: boolean }
  color: string
}> = ({ title, value, icon, trend, color }) => {
  return (
    <Card hover padding="lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-neutral-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-neutral-900 mb-2">{value}</p>
          {trend && (
            <div className="flex items-center gap-1">
              <TrendingUp 
                className={`w-4 h-4 ${trend.isPositive ? 'text-green-600' : 'text-red-600'} ${!trend.isPositive && 'rotate-180'}`}
              />
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.value}%
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  // Données mockées (à remplacer par de vraies API calls)
  const stats = {
    totalStudents: 845,
    totalTeachers: 42,
    totalClasses: 28,
    averageGrade: 14.5,
  }

  const recentActivities = [
    {
      id: 1,
      type: 'grade',
      title: 'Nouvelle note en Mathématiques',
      description: '16/20 - Devoir n°3',
      time: 'Il y a 2h',
    },
    {
      id: 2,
      type: 'absence',
      title: 'Absence enregistrée',
      description: 'Le 15 janvier 2025',
      time: 'Il y a 1 jour',
    },
    {
      id: 3,
      type: 'announcement',
      title: 'Réunion parents-professeurs',
      description: 'Samedi 20 janvier à 9h',
      time: 'Il y a 3 jours',
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: 'Composition Trimestre 2',
      date: '22 Jan - 26 Jan 2025',
      type: 'exam',
    },
    {
      id: 2,
      title: 'Journée Portes Ouvertes',
      date: '28 Janvier 2025',
      type: 'event',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br bg-blue-900  rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">
          Bonjour, {user?.firstName} !
        </h1>
        <p className="text-primary-100">
          Bienvenue sur votre tableau de bord. Voici un aperçu de votre activité.
        </p>
      </motion.div>

      {/* Stats Grid - Conditional based on role */}
      {(user?.role === UserRole.ADMIN || user?.role === UserRole.PRINCIPAL || user?.role === UserRole.ACADEMIC_HEAD) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Élèves"
            value={stats.totalStudents}
            icon={<GraduationCap className="w-6 h-6 text-primary-600" />}
            trend={{ value: 5, isPositive: true }}
            color="bg-primary-50"
          />
          <StatCard
            title="Enseignants"
            value={stats.totalTeachers}
            icon={<Users className="w-6 h-6 text-secondary-600" />}
            color="bg-secondary-50"
          />
          <StatCard
            title="Classes"
            value={stats.totalClasses}
            icon={<BookOpen className="w-6 h-6 text-accent-600" />}
            color="bg-accent-50"
          />
          <StatCard
            title="Moyenne Générale"
            value={stats.averageGrade}
            icon={<Award className="w-6 h-6 text-green-600" />}
            trend={{ value: 2, isPositive: true }}
            color="bg-green-50"
          />
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card padding="none" className="lg:col-span-2">
          <CardHeader title="Activités Récentes" className="p-6 pb-4" />
          <div className="divide-y divide-neutral-100">
            {recentActivities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-6 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activity.type === 'grade' ? 'bg-blue-50' :
                    activity.type === 'absence' ? 'bg-red-50' :
                    'bg-purple-50'
                  }`}>
                    {activity.type === 'grade' && <BookOpen className="w-5 h-5 text-blue-600" />}
                    {activity.type === 'absence' && <AlertCircle className="w-5 h-5 text-red-600" />}
                    {activity.type === 'announcement' && <Calendar className="w-5 h-5 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-900 mb-1">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-neutral-600 mb-2">
                      {activity.description}
                    </p>
                    <span className="text-xs text-neutral-400">
                      {activity.time}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card padding="none">
          <CardHeader title="Événements à Venir" className="p-6 pb-4" />
          <div className="p-6 space-y-4">
            {upcomingEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-neutral-900">
                    {event.title}
                  </h4>
                  <Badge variant={event.type === 'exam' ? 'warning' : 'info'} size="sm">
                    {event.type === 'exam' ? 'Examen' : 'Événement'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Calendar className="w-4 h-4" />
                  {event.date}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions - Student View */}
      {user?.role === UserRole.STUDENT && (
        <Card padding="lg">
          <CardHeader title="Mes Notes Récentes" description="Dernières évaluations" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 bg-primary-50 rounded-lg">
              <p className="text-sm text-primary-700 mb-1">Mathématiques</p>
              <p className="text-2xl font-bold text-primary-900">16/20</p>
              <p className="text-xs text-primary-600 mt-1">Devoir n°3</p>
            </div>
            <div className="p-4 bg-secondary-50 rounded-lg">
              <p className="text-sm text-secondary-700 mb-1">Français</p>
              <p className="text-2xl font-bold text-secondary-900">14/20</p>
              <p className="text-xs text-secondary-600 mt-1">Devoir n°2</p>
            </div>
            <div className="p-4 bg-accent-50 rounded-lg">
              <p className="text-sm text-accent-700 mb-1">Anglais</p>
              <p className="text-2xl font-bold text-accent-900">15/20</p>
              <p className="text-xs text-accent-600 mt-1">Interrogation</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}