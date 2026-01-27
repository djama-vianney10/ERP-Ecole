/**
 * Fichier : src/app/(dashboard)/parent/children/page.tsx
 * Rôle : Page de vue d'ensemble des enfants pour les parents
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  GraduationCap, 
  TrendingUp, 
  Calendar,
  BookOpen,
  Award,
  AlertCircle,
  Eye,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardHeader } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import Button from '@/shared/components/ui/Button'

interface Child {
  id: string
  firstName: string
  lastName: string
  class: string
  average: number
  attendance: number
  lastGrade: {
    subject: string
    score: number
    date: string
  }
}

export default function ParentChildrenPage() {
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch children from API
    // Données mockées pour l'exemple
    setChildren([
      {
        id: '1',
        firstName: 'Yao',
        lastName: 'Kouamé',
        class: '6ème A',
        average: 16.5,
        attendance: 95,
        lastGrade: {
          subject: 'Mathématiques',
          score: 18,
          date: '2025-01-25'
        }
      },
      {
        id: '2',
        firstName: 'Aya',
        lastName: 'Kouamé',
        class: '3ème B',
        average: 15.2,
        attendance: 98,
        lastGrade: {
          subject: 'Français',
          score: 16,
          date: '2025-01-24'
        }
      }
    ])
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
    </div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Mes Enfants
        </h1>
        <p className="text-neutral-600">
          Suivez la scolarité de vos enfants en temps réel
        </p>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hover padding="lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{children.length}</p>
              <p className="text-sm text-neutral-600">Enfant{children.length > 1 ? 's' : ''}</p>
            </div>
          </div>
        </Card>

        <Card hover padding="lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-secondary-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">
                {children.length > 0 
                  ? (children.reduce((sum, c) => sum + c.average, 0) / children.length).toFixed(1)
                  : '0'
                }
              </p>
              <p className="text-sm text-neutral-600">Moyenne générale</p>
            </div>
          </div>
        </Card>

        <Card hover padding="lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">
                {children.length > 0 
                  ? Math.round(children.reduce((sum, c) => sum + c.attendance, 0) / children.length)
                  : '0'
                }%
              </p>
              <p className="text-sm text-neutral-600">Assiduité</p>
            </div>
          </div>
        </Card>

        <Card hover padding="lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">3</p>
              <p className="text-sm text-neutral-600">Notifications</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Liste des enfants */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-900">
          Vue d'ensemble
        </h2>

        {children.map((child, index) => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover padding="lg">
              <div className="flex items-start justify-between gap-4">
                {/* Info enfant */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-xl font-bold">
                    {child.firstName[0]}{child.lastName[0]}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-neutral-900">
                        {child.firstName} {child.lastName}
                      </h3>
                      <Badge variant="neutral">{child.class}</Badge>
                    </div>

                    {/* Stats de l'enfant */}
                    <div className="grid grid-cols-3 gap-6 mt-4">
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Moyenne</p>
                        <div className="flex items-center gap-2">
                          <p className={`text-2xl font-bold ${
                            child.average >= 16 ? 'text-green-600' :
                            child.average >= 14 ? 'text-blue-600' :
                            child.average >= 10 ? 'text-orange-600' :
                            'text-red-600'
                          }`}>
                            {child.average}
                          </p>
                          <span className="text-sm text-neutral-500">/20</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Assiduité</p>
                        <div className="flex items-center gap-2">
                          <p className={`text-2xl font-bold ${
                            child.attendance >= 95 ? 'text-green-600' :
                            child.attendance >= 90 ? 'text-blue-600' :
                            'text-orange-600'
                          }`}>
                            {child.attendance}%
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Dernière note</p>
                        <p className="text-sm font-medium text-neutral-900">
                          {child.lastGrade.subject}
                        </p>
                        <p className="text-xs text-neutral-600">
                          {child.lastGrade.score}/20 - {new Date(child.lastGrade.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<Eye className="w-4 h-4" />}
                  >
                    Voir le détail
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Actions rapides */}
      <Card padding="lg">
        <CardHeader title="Actions Rapides" className="mb-4" />
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/parent/notifications">
            <div className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer">
              <AlertCircle className="w-6 h-6 text-primary-600 mb-2" />
              <p className="font-medium text-neutral-900">Notifications</p>
              <p className="text-sm text-neutral-600">3 non lues</p>
            </div>
          </Link>

          <div className="p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors cursor-pointer">
            <BookOpen className="w-6 h-6 text-secondary-600 mb-2" />
            <p className="font-medium text-neutral-900">Bulletins</p>
            <p className="text-sm text-neutral-600">Consulter les bulletins</p>
          </div>

          <div className="p-4 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors cursor-pointer">
            <Calendar className="w-6 h-6 text-accent-600 mb-2" />
            <p className="font-medium text-neutral-900">Calendrier</p>
            <p className="text-sm text-neutral-600">Événements à venir</p>
          </div>
        </div>
      </Card>
    </div>
  )
}