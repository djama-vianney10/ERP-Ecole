/**
 * Fichier : src/app/(dashboard)/student/schedule/page.tsx
 * Rôle : Page de l'emploi du temps pour les élèves
 * Architecture : Vue hebdomadaire interactive de l'emploi du temps
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar,
  Clock,
  BookOpen,
  MapPin,
  Download,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react'
import { Card, CardHeader } from '@/shared/components/ui/Card'
import { Badge } from '@/shared/components/ui/Badge'
import Button from '@/shared/components/ui/Button'
import { useAuth } from '@/shared/hooks/useAuth'

interface ScheduleItem {
  id: string
  subject: string
  subjectCode: string
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY'
  startTime: string
  endTime: string
  room: string
  teacherName: string
  color: string
}

const DAYS = [
  { key: 'MONDAY', label: 'Lundi' },
  { key: 'TUESDAY', label: 'Mardi' },
  { key: 'WEDNESDAY', label: 'Mercredi' },
  { key: 'THURSDAY', label: 'Jeudi' },
  { key: 'FRIDAY', label: 'Vendredi' },
  { key: 'SATURDAY', label: 'Samedi' },
]

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
]

export default function StudentSchedulePage() {
  const { user } = useAuth()
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(0)
  const [viewMode, setViewMode] = useState<'week' | 'list'>('week')

  useEffect(() => {
    fetchSchedule()
  }, [])

  const fetchSchedule = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/student/schedule')
      const data = await response.json()
      
      if (data.success) {
        setSchedule(data.schedule)
      }
    } catch (error) {
      console.error('Error fetching schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSubjectColor = (subjectCode: string) => {
    const colors: { [key: string]: string } = {
      'MATH': 'from-blue-500 to-blue-600',
      'FR': 'from-purple-500 to-purple-600',
      'EN': 'from-green-500 to-green-600',
      'HG': 'from-orange-500 to-orange-600',
      'PC': 'from-red-500 to-red-600',
      'SVT': 'from-teal-500 to-teal-600',
      'EPS': 'from-yellow-500 to-yellow-600',
    }
    return colors[subjectCode] || 'from-neutral-500 to-neutral-600'
  }

  const getScheduleForDay = (day: string) => {
    return schedule.filter(item => item.dayOfWeek === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const getCurrentDayIndex = () => {
    const today = new Date().getDay()
    return today === 0 ? 6 : today - 1 // Adjust Sunday
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
            Mon Emploi du Temps
          </h1>
          <p className="text-neutral-600">
            Consultez votre programme hebdomadaire
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'week'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Liste
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Télécharger
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hover padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Cours/Semaine</p>
              <p className="text-3xl font-bold text-neutral-900">
                {schedule.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card hover padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Heures/Semaine</p>
              <p className="text-3xl font-bold text-neutral-900">
                {schedule.reduce((acc, item) => {
                  const start = parseInt(item.startTime.split(':')[0])
                  const end = parseInt(item.endTime.split(':')[0])
                  return acc + (end - start)
                }, 0)}h
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-secondary-50 flex items-center justify-center">
              <Clock className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </Card>

        <Card hover padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Matières</p>
              <p className="text-3xl font-bold text-neutral-900">
                {new Set(schedule.map(s => s.subject)).size}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-accent-50 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-accent-600" />
            </div>
          </div>
        </Card>

        <Card hover padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 mb-1">Aujourd'hui</p>
              <p className="text-3xl font-bold text-neutral-900">
                {getScheduleForDay(DAYS[getCurrentDayIndex()]?.key || 'MONDAY').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Week View */}
      {viewMode === 'week' && (
        <Card padding="none" className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-7 border-b border-neutral-200">
              <div className="p-4 border-r border-neutral-200 bg-neutral-50">
                <p className="text-sm font-medium text-neutral-600">Heure</p>
              </div>
              {DAYS.map((day, index) => (
                <div
                  key={day.key}
                  className={`p-4 border-r border-neutral-200 ${
                    index === getCurrentDayIndex() ? 'bg-primary-50' : 'bg-neutral-50'
                  }`}
                >
                  <p className={`text-sm font-medium ${
                    index === getCurrentDayIndex() ? 'text-primary-700' : 'text-neutral-700'
                  }`}>
                    {day.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Schedule Grid */}
            <div className="relative">
              {DAYS.map((day, dayIndex) => {
                const daySchedule = getScheduleForDay(day.key)
                return daySchedule.map((item, itemIndex) => {
                  const startHour = parseInt(item.startTime.split(':')[0])
                  const startMinute = parseInt(item.startTime.split(':')[1])
                  const endHour = parseInt(item.endTime.split(':')[0])
                  const endMinute = parseInt(item.endTime.split(':')[1])
                  
                  const topPosition = ((startHour - 8) * 60 + startMinute) * (80 / 60)
                  const height = ((endHour - startHour) * 60 + (endMinute - startMinute)) * (80 / 60)

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: itemIndex * 0.05 }}
                      className="absolute"
                      style={{
                        left: `${(100 / 7) * (dayIndex + 1)}%`,
                        top: `${topPosition}px`,
                        width: `${100 / 7}%`,
                        height: `${height}px`,
                        padding: '4px',
                      }}
                    >
                      <div className={`h-full rounded-lg bg-gradient-to-br ${getSubjectColor(item.subjectCode)} text-white p-3 shadow-md hover:shadow-lg transition-shadow cursor-pointer`}>
                        <p className="font-semibold text-sm mb-1">{item.subject}</p>
                        <p className="text-xs opacity-90 mb-1">
                          {item.startTime} - {item.endTime}
                        </p>
                        <p className="text-xs opacity-75 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {item.room}
                        </p>
                      </div>
                    </motion.div>
                  )
                })
              })}

              {/* Time Grid */}
              {TIME_SLOTS.map((time, index) => (
                <div
                  key={time}
                  className="grid grid-cols-7 border-b border-neutral-100"
                  style={{ height: '80px' }}
                >
                  <div className="border-r border-neutral-200 p-2 bg-neutral-50">
                    <p className="text-xs text-neutral-500">{time}</p>
                  </div>
                  {DAYS.map((day) => (
                    <div key={day.key} className="border-r border-neutral-100" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {DAYS.map((day, dayIndex) => {
            const daySchedule = getScheduleForDay(day.key)
            
            if (daySchedule.length === 0) return null

            return (
              <div key={day.key}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-bold text-neutral-900">
                    {day.label}
                  </h2>
                  {dayIndex === getCurrentDayIndex() && (
                    <Badge variant="primary">Aujourd'hui</Badge>
                  )}
                </div>

                <div className="space-y-3">
                  {daySchedule.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card hover padding="lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-16 rounded-full bg-gradient-to-b ${getSubjectColor(item.subjectCode)}`} />
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-neutral-900">
                                {item.subject}
                              </h3>
                              <Badge variant="neutral" size="sm">
                                {item.subjectCode}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm text-neutral-600">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {item.startTime} - {item.endTime}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {item.room}
                              </span>
                              <span>Prof. {item.teacherName}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}