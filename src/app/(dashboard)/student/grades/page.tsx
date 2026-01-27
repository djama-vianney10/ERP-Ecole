/**
 * Fichier : src/app/(dashboard)/student/grades/page.tsx
 * Rôle : Page des notes pour les élèves
 * Architecture : Vue détaillée des notes par matière et période
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  TrendingUp, 
  TrendingDown,
  Award,
  Calendar,
  Filter,
  Download,
  Eye,
  ChevronDown,
  BarChart3
} from 'lucide-react'
import { Card, CardHeader } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import Button from '@/shared/components/ui/Button'
import { useAuth } from '@/shared/hooks/useAuth'

interface Grade {
  id: string
  subject: string
  subjectCode: string
  type: 'DEVOIR' | 'COMPOSITION' | 'INTERROGATION' | 'ORAL' | 'PRATIQUE'
  period: 'TRIMESTRE_1' | 'TRIMESTRE_2' | 'TRIMESTRE_3'
  score: number
  maxScore: number
  coefficient: number
  evaluationDate: string
  description: string
  teacherName: string
}

interface SubjectAverage {
  subject: string
  average: number
  coefficient: number
  grades: Grade[]
}

export default function StudentGradesPage() {
  const { user } = useAuth()
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<string>('TRIMESTRE_1')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')

  useEffect(() => {
    fetchGrades()
  }, [selectedPeriod])

  const fetchGrades = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/student/grades?period=${selectedPeriod}`)
      const data = await response.json()
      
      if (data.success) {
        setGrades(data.grades)
      }
    } catch (error) {
      console.error('Error fetching grades:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculer les moyennes par matière
  const subjectAverages: SubjectAverage[] = grades.reduce((acc, grade) => {
    const existing = acc.find(s => s.subject === grade.subject)
    
    if (existing) {
      existing.grades.push(grade)
    } else {
      acc.push({
        subject: grade.subject,
        average: 0,
        coefficient: grade.coefficient,
        grades: [grade]
      })
    }
    
    return acc
  }, [] as SubjectAverage[])

  // Calculer la moyenne de chaque matière
  subjectAverages.forEach(subject => {
    const totalWeight = subject.grades.reduce((sum, g) => sum + (g.score / g.maxScore * 20), 0)
    subject.average = totalWeight / subject.grades.length
  })

  // Calculer la moyenne générale
  const generalAverage = subjectAverages.length > 0
    ? subjectAverages.reduce((sum, s) => sum + s.average * s.coefficient, 0) /
      subjectAverages.reduce((sum, s) => sum + s.coefficient, 0)
    : 0

  const filteredGrades = selectedSubject === 'all' 
    ? grades 
    : grades.filter(g => g.subject === selectedSubject)

  const getGradeColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-blue-600'
    if (percentage >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  const getGradeBadge = (type: string) => {
    switch (type) {
      case 'COMPOSITION':
        return <Badge variant="error">Composition</Badge>
      case 'DEVOIR':
        return <Badge variant="info">Devoir</Badge>
      case 'INTERROGATION':
        return <Badge variant="warning">Interrogation</Badge>
      case 'ORAL':
        return <Badge variant="success">Oral</Badge>
      case 'PRATIQUE':
        return <Badge variant="neutral">TP</Badge>
      default:
        return <Badge variant="neutral">{type}</Badge>
    }
  }

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
            Mes Notes
          </h1>
          <p className="text-neutral-600">
            Consultez vos résultats et suivez votre progression
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Download className="w-4 h-4" />}
        >
          Télécharger le bulletin
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hover padding="lg" className="bg-gradient-to-br from-primary-50 to-primary-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-700 mb-1">Moyenne Générale</p>
              <p className="text-4xl font-bold text-primary-900">
                {generalAverage.toFixed(2)}
              </p>
              <p className="text-xs text-primary-600 mt-1">/ 20</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-primary-500 flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
        </Card>

        <Card hover padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Notes Totales</p>
              <p className="text-3xl font-bold text-neutral-900">
                {grades.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-secondary-50 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </Card>

        <Card hover padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Matières</p>
              <p className="text-3xl font-bold text-neutral-900">
                {subjectAverages.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-accent-50 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-accent-600" />
            </div>
          </div>
        </Card>

        <Card hover padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Progression</p>
              <p className="text-3xl font-bold text-green-600 flex items-center gap-1">
                +2.3
                <TrendingUp className="w-5 h-5" />
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card padding="lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Période
            </label>
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full appearance-none px-4 py-2 pr-10 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="TRIMESTRE_1">1er Trimestre</option>
                <option value="TRIMESTRE_2">2ème Trimestre</option>
                <option value="TRIMESTRE_3">3ème Trimestre</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Matière
            </label>
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full appearance-none px-4 py-2 pr-10 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="all">Toutes les matières</option>
                {subjectAverages.map((subject) => (
                  <option key={subject.subject} value={subject.subject}>
                    {subject.subject}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </Card>

      {/* Subject Averages */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-4">
          Moyennes par Matière
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectAverages.map((subject, index) => (
            <motion.div
              key={subject.subject}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card hover padding="lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 mb-1">
                      {subject.subject}
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Coef. {subject.coefficient}
                    </p>
                  </div>
                  <div className={`text-2xl font-bold ${
                    subject.average >= 16 ? 'text-green-600' :
                    subject.average >= 14 ? 'text-blue-600' :
                    subject.average >= 10 ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {subject.average.toFixed(1)}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-neutral-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      subject.average >= 16 ? 'bg-green-500' :
                      subject.average >= 14 ? 'bg-blue-500' :
                      subject.average >= 10 ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${(subject.average / 20) * 100}%` }}
                  />
                </div>
                
                <p className="text-xs text-neutral-500 mt-2">
                  {subject.grades.length} note{subject.grades.length > 1 ? 's' : ''}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detailed Grades */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 mb-4">
          Notes Détaillées
        </h2>
        <div className="space-y-3">
          {filteredGrades.length === 0 ? (
            <Card padding="lg">
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-600 text-lg">
                  Aucune note pour cette période
                </p>
              </div>
            </Card>
          ) : (
            filteredGrades.map((grade, index) => (
              <motion.div
                key={grade.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card hover padding="lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-neutral-900">
                          {grade.subject}
                        </h3>
                        {getGradeBadge(grade.type)}
                      </div>
                      
                      <p className="text-neutral-700 mb-3">
                        {grade.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(grade.evaluationDate).toLocaleDateString('fr-FR')}
                        </span>
                        <span>Prof. {grade.teacherName}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-4xl font-bold ${getGradeColor(grade.score, grade.maxScore)}`}>
                        {grade.score}
                      </div>
                      <div className="text-sm text-neutral-500">
                        / {grade.maxScore}
                      </div>
                      <div className="text-xs text-neutral-400 mt-1">
                        ({((grade.score / grade.maxScore) * 100).toFixed(0)}%)
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}