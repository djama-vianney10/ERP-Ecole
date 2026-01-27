/**
 * Fichier : src/app/(dashboard)/student/attendance/page.tsx
 * Rôle : Page de suivi d'assiduité pour les élèves
 * Architecture : Historique des présences, absences et retards
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import Button from '@/shared/components/ui/Button'

interface AttendanceRecord {
  id: string
  date: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
  isJustified: boolean
  justification?: string
  teacherName: string
}

export default function StudentAttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    fetchAttendance()
  }, [selectedMonth])

  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const year = selectedMonth.getFullYear()
      const month = selectedMonth.getMonth() + 1
      
      const response = await fetch(`/api/student/attendance?year=${year}&month=${month}`)
      const data = await response.json()
      
      if (data.success) {
        setAttendance(data.attendance)
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'ABSENT':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'LATE':
        return <Clock className="w-5 h-5 text-orange-600" />
      case 'EXCUSED':
        return <AlertTriangle className="w-5 h-5 text-blue-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-50 border-green-200 text-green-700'
      case 'ABSENT':
        return 'bg-red-50 border-red-200 text-red-700'
      case 'LATE':
        return 'bg-orange-50 border-orange-200 text-orange-700'
      case 'EXCUSED':
        return 'bg-blue-50 border-blue-200 text-blue-700'
      default:
        return 'bg-neutral-50 border-neutral-200 text-neutral-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'Présent'
      case 'ABSENT':
        return 'Absent'
      case 'LATE':
        return 'Retard'
      case 'EXCUSED':
        return 'Justifié'
      default:
        return status
    }
  }

  // Statistiques
  const stats = {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'PRESENT').length,
    absent: attendance.filter(a => a.status === 'ABSENT' && !a.isJustified).length,
    late: attendance.filter(a => a.status === 'LATE').length,
    excused: attendance.filter(a => a.isJustified).length,
  }

  const attendanceRate = stats.total > 0 
    ? ((stats.present / stats.total) * 100).toFixed(1)
    : 0

  // Filtrage
  const filteredAttendance = filterStatus === 'all'
    ? attendance
    : attendance.filter(a => a.status === filterStatus)

  // Navigation mois
  const previousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))
  }

  // Calendrier
  const getDaysInMonth = () => {
    const year = selectedMonth.getFullYear()
    const month = selectedMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }

  const getAttendanceForDate = (day: number) => {
    const dateStr = `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return attendance.find(a => a.date.startsWith(dateStr))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Mon Assiduité
          </h1>
          <p className="text-neutral-600">
            Consultez votre historique de présence
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Download className="w-4 h-4" />}
        >
          Télécharger
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card hover padding="lg" className="bg-gradient-to-br from-primary-50 to-primary-100">
          <div className="text-center">
            <p className="text-sm text-primary-700 mb-2">Taux de Présence</p>
            <p className="text-4xl font-bold text-primary-900 mb-1">
              {attendanceRate}%
            </p>
            <div className="flex items-center justify-center gap-1 text-xs text-primary-600">
              <TrendingUp className="w-3 h-3" />
              <span>Excellent</span>
            </div>
          </div>
        </Card>

        <Card hover padding="lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stats.present}</p>
              <p className="text-xs text-neutral-600">Présent</p>
            </div>
          </div>
        </Card>

        <Card hover padding="lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stats.absent}</p>
              <p className="text-xs text-neutral-600">Absent</p>
            </div>
          </div>
        </Card>

        <Card hover padding="lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stats.late}</p>
              <p className="text-xs text-neutral-600">Retards</p>
            </div>
          </div>
        </Card>

        <Card hover padding="lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{stats.excused}</p>
              <p className="text-xs text-neutral-600">Justifiés</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Calendar View */}
      <Card padding="lg">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-neutral-900">
              {selectedMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={previousMonth}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
              >
                Précédent
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextMonth}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Suivant
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Days of week header */}
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-neutral-600 py-2">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1
              const record = getAttendanceForDate(day)
              const isToday = 
                day === new Date().getDate() &&
                selectedMonth.getMonth() === new Date().getMonth() &&
                selectedMonth.getFullYear() === new Date().getFullYear()

              return (
                <motion.div
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isToday ? 'border-primary-500 bg-primary-50' : 'border-neutral-200'
                  } ${
                    record ? getStatusColor(record.status) : 'bg-white hover:bg-neutral-50'
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    isToday ? 'text-primary-700' : 'text-neutral-700'
                  }`}>
                    {day}
                  </span>
                  {record && (
                    <div className="mt-1">
                      {getStatusIcon(record.status)}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-6 border-t border-neutral-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-neutral-600">Présent</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-neutral-600">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-neutral-600">Retard</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-neutral-600">Justifié</span>
          </div>
        </div>
      </Card>

      {/* Attendance History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-neutral-900">
            Historique Détaillé
          </h2>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="PRESENT">Présent</option>
            <option value="ABSENT">Absent</option>
            <option value="LATE">Retard</option>
            <option value="EXCUSED">Justifié</option>
          </select>
        </div>

        <div className="space-y-3">
          {filteredAttendance.length === 0 ? (
            <Card padding="lg">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-600 text-lg">
                  Aucun enregistrement trouvé
                </p>
              </div>
            </Card>
          ) : (
            filteredAttendance.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card hover padding="lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-neutral-900">
                            {new Date(record.date).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </h3>
                          <Badge
                            variant={
                              record.status === 'PRESENT' ? 'success' :
                              record.status === 'ABSENT' ? 'error' :
                              record.status === 'LATE' ? 'warning' :
                              'info'
                            }
                            size="sm"
                          >
                            {getStatusLabel(record.status)}
                          </Badge>
                          {record.isJustified && (
                            <Badge variant="info" size="sm">Justifié</Badge>
                          )}
                        </div>

                        {record.justification && (
                          <p className="text-sm text-neutral-600 mb-1">
                            {record.justification}
                          </p>
                        )}

                        <p className="text-xs text-neutral-500">
                          Enregistré par {record.teacherName}
                        </p>
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