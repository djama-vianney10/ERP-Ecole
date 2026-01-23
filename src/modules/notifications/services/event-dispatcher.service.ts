/**
 * Fichier : src/modules/notifications/services/event-dispatcher.service.ts
 * Rôle : Dispatcher d'événements pour déclencher des notifications automatiques
 * Architecture : Event-driven pattern pour couplage faible
 */

import { NotificationService } from './notification.service'
import { NotificationType, NotificationPriority } from '@prisma/client'
import prisma from '@/shared/lib/prisma'

export class EventDispatcher {
  /**
   * Événement : Nouvelle note publiée
   * Notifie l'élève et ses parents
   */
  static async onNewGrade(gradeId: string) {
    try {
      const grade = await prisma.grade.findUnique({
        where: { id: gradeId },
        include: {
          student: {
            include: {
              user: true,
              parents: {
                include: {
                  parent: {
                    include: { user: true },
                  },
                },
              },
            },
          },
          subject: true,
        },
      })

      if (!grade) return

      const notifications = []

      // Notification pour l'élève
      notifications.push({
        userId: grade.student.userId,
        type: NotificationType.NEW_GRADE,
        priority: NotificationPriority.MEDIUM,
        title: 'Nouvelle note disponible',
        message: `Vous avez obtenu ${grade.score}/${grade.maxScore} en ${grade.subject.name}`,
        metadata: {
          gradeId: grade.id,
          subjectId: grade.subjectId,
          score: grade.score,
        },
      })

      // Notifications pour les parents
      for (const parentRelation of grade.student.parents) {
        notifications.push({
          userId: parentRelation.parent.userId,
          type: NotificationType.NEW_GRADE,
          priority: NotificationPriority.MEDIUM,
          title: `Note de ${grade.student.firstName}`,
          message: `${grade.student.firstName} a obtenu ${grade.score}/${grade.maxScore} en ${grade.subject.name}`,
          metadata: {
            gradeId: grade.id,
            studentId: grade.studentId,
            subjectId: grade.subjectId,
            score: grade.score,
          },
        })
      }

      await NotificationService.createMany(notifications)
    } catch (error) {
      console.error('Error dispatching new grade event:', error)
    }
  }

  /**
   * Événement : Absence enregistrée
   * Notifie l'élève et ses parents
   */
  static async onAbsence(attendanceId: string) {
    try {
      const attendance = await prisma.attendanceRecord.findUnique({
        where: { id: attendanceId },
        include: {
          student: {
            include: {
              user: true,
              parents: {
                include: {
                  parent: {
                    include: { user: true },
                  },
                },
              },
            },
          },
        },
      })

      if (!attendance || attendance.status !== 'ABSENT') return

      const notifications = []

      // Notification pour l'élève
      notifications.push({
        userId: attendance.student.userId,
        type: NotificationType.ABSENCE_ALERT,
        priority: NotificationPriority.HIGH,
        title: 'Absence enregistrée',
        message: `Vous avez été absent(e) le ${new Date(attendance.date).toLocaleDateString('fr-FR')}`,
        metadata: {
          attendanceId: attendance.id,
          date: attendance.date,
        },
      })

      // Notifications pour les parents (priorité URGENT)
      for (const parentRelation of attendance.student.parents) {
        notifications.push({
          userId: parentRelation.parent.userId,
          type: NotificationType.ABSENCE_ALERT,
          priority: NotificationPriority.URGENT,
          title: `Absence de ${attendance.student.firstName}`,
          message: `${attendance.student.firstName} ${attendance.student.lastName} a été absent(e) le ${new Date(attendance.date).toLocaleDateString('fr-FR')}`,
          metadata: {
            attendanceId: attendance.id,
            studentId: attendance.studentId,
            date: attendance.date,
          },
        })
      }

      await NotificationService.createMany(notifications)
    } catch (error) {
      console.error('Error dispatching absence event:', error)
    }
  }

  /**
   * Événement : Retard enregistré
   */
  static async onLate(attendanceId: string) {
    try {
      const attendance = await prisma.attendanceRecord.findUnique({
        where: { id: attendanceId },
        include: {
          student: {
            include: {
              user: true,
              parents: {
                include: {
                  parent: {
                    include: { user: true },
                  },
                },
              },
            },
          },
        },
      })

      if (!attendance || attendance.status !== 'LATE') return

      const notifications = []

      // Notification pour l'élève
      notifications.push({
        userId: attendance.student.userId,
        type: NotificationType.LATE_ALERT,
        priority: NotificationPriority.MEDIUM,
        title: 'Retard enregistré',
        message: `Vous avez été en retard le ${new Date(attendance.date).toLocaleDateString('fr-FR')}`,
        metadata: {
          attendanceId: attendance.id,
          date: attendance.date,
        },
      })

      // Notifications pour les parents
      for (const parentRelation of attendance.student.parents) {
        notifications.push({
          userId: parentRelation.parent.userId,
          type: NotificationType.LATE_ALERT,
          priority: NotificationPriority.MEDIUM,
          title: `Retard de ${attendance.student.firstName}`,
          message: `${attendance.student.firstName} ${attendance.student.lastName} a été en retard le ${new Date(attendance.date).toLocaleDateString('fr-FR')}`,
          metadata: {
            attendanceId: attendance.id,
            studentId: attendance.studentId,
            date: attendance.date,
          },
        })
      }

      await NotificationService.createMany(notifications)
    } catch (error) {
      console.error('Error dispatching late event:', error)
    }
  }

  /**
   * Événement : Bulletin disponible
   */
  static async onReportCardReady(studentId: string, period: string) {
    try {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
          user: true,
          parents: {
            include: {
              parent: {
                include: { user: true },
              },
            },
          },
        },
      })

      if (!student) return

      const notifications = []

      // Notification pour l'élève
      notifications.push({
        userId: student.userId,
        type: NotificationType.REPORT_CARD_READY,
        priority: NotificationPriority.HIGH,
        title: 'Bulletin disponible',
        message: `Votre bulletin du ${period} est disponible`,
        metadata: {
          studentId: student.id,
          period,
        },
      })

      // Notifications pour les parents
      for (const parentRelation of student.parents) {
        notifications.push({
          userId: parentRelation.parent.userId,
          type: NotificationType.REPORT_CARD_READY,
          priority: NotificationPriority.HIGH,
          title: `Bulletin de ${student.firstName}`,
          message: `Le bulletin du ${period} de ${student.firstName} ${student.lastName} est disponible`,
          metadata: {
            studentId: student.id,
            period,
          },
        })
      }

      await NotificationService.createMany(notifications)
    } catch (error) {
      console.error('Error dispatching report card event:', error)
    }
  }
}