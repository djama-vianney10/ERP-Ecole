/**
 * Fichier : src/app/(dashboard)/teacher/classes/page.tsx
 * Rôle : Page de gestion des classes pour les enseignants
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  School,
  Users,
  BookOpen,
  Calendar,
  ChevronRight,
  Eye,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardHeader } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import Button from '@/shared/components/ui/Button'
import { TeacherClass } from '@/types/common.types'

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<TeacherClass[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch teacher classes from API
    setClasses([])
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
    </div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Mes Classes
        </h1>
        <p className="text-neutral-600">
          Gérez vos classes et suivez la progression des élèves
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hover padding="lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
              <School className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{classes.length}</p>
              <p className="text-sm text-neutral-600">Classes</p>
            </div>
          </div>
        </Card>

        <Card hover padding="lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-secondary-50 flex items-center justify-center">
              <Users className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">
                {classes.reduce((sum, c) => sum + c.studentCount, 0)}
              </p>
              <p className="text-sm text-neutral-600">Élèves</p>
            </div>
          </div>
        </Card>

        <Card hover padding="lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-accent-50 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">18</p>
              <p className="text-sm text-neutral-600">Cours/semaine</p>
            </div>
          </div>
        </Card>

        <Card hover padding="lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">3</p>
              <p className="text-sm text-neutral-600">Aujourd'hui</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Liste des classes */}
      <div className="space-y-4">
        {classes.map((classItem, index) => (
          <motion.div
            key={classItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover padding="lg">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xl font-bold">
                    {classItem.name.split(' ')[0]}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-neutral-900">
                        {classItem.name}
                      </h3>
                      <Badge variant="primary">{classItem.subject}</Badge>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-neutral-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {classItem.studentCount} élèves
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(classItem.nextSession).toLocaleString('fr-FR', {
                          weekday: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <School className="w-4 h-4" />
                        {classItem.room}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<FileText className="w-4 h-4" />}
                  >
                    Notes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Eye className="w-4 h-4" />}
                  >
                    Détails
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}