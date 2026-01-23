/**
 * Fichier : src/modules/notifications/services/notification.service.ts
 * Rôle : Service de gestion des notifications avec système événementiel
 * Architecture : Event-driven design pour notifications temps réel
 */

import prisma from '@/shared/lib/prisma'
import { NotificationType, NotificationPriority } from '@prisma/client'

export interface CreateNotificationData {
  userId: string
  type: NotificationType
  priority?: NotificationPriority
  title: string
  message: string
  metadata?: Record<string, any>
}

export class NotificationService {
  /**
   * Créer une notification
   */
  static async create(data: CreateNotificationData) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: data.userId,
          type: data.type,
          priority: data.priority || NotificationPriority.MEDIUM,
          title: data.title,
          message: data.message,
          metadata: data.metadata || {},
        },
      })

      return { success: true, notification }
    } catch (error) {
      console.error('Error creating notification:', error)
      return { success: false, error: 'Erreur lors de la création de la notification' }
    }
  }

  /**
   * Créer plusieurs notifications (bulk)
   */
  static async createMany(notifications: CreateNotificationData[]) {
    try {
      await prisma.notification.createMany({
        data: notifications.map((n) => ({
          userId: n.userId,
          type: n.type,
          priority: n.priority || NotificationPriority.MEDIUM,
          title: n.title,
          message: n.message,
          metadata: n.metadata || {},
        })),
      })

      return { success: true }
    } catch (error) {
      console.error('Error creating notifications:', error)
      return { success: false, error: 'Erreur lors de la création des notifications' }
    }
  }

  /**
   * Récupérer les notifications d'un utilisateur
   */
  static async getUserNotifications(
    userId: string,
    options?: { limit?: number; unreadOnly?: boolean }
  ) {
    try {
      const notifications = await prisma.notification.findMany({
        where: {
          userId,
          ...(options?.unreadOnly ? { isRead: false } : {}),
        },
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 50,
      })

      return { success: true, notifications }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      return { success: false, notifications: [] }
    }
  }

  /**
   * Marquer une notification comme lue
   */
  static async markAsRead(notificationId: string, userId: string) {
    try {
      const notification = await prisma.notification.update({
        where: {
          id: notificationId,
          userId, // Sécurité : vérifier que la notif appartient à l'user
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      })

      return { success: true, notification }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      return { success: false, error: 'Erreur lors de la mise à jour' }
    }
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  static async markAllAsRead(userId: string) {
    try {
      await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      })

      return { success: true }
    } catch (error) {
      console.error('Error marking all as read:', error)
      return { success: false, error: 'Erreur lors de la mise à jour' }
    }
  }

  /**
   * Compter les notifications non lues
   */
  static async getUnreadCount(userId: string) {
    try {
      const count = await prisma.notification.count({
        where: {
          userId,
          isRead: false,
        },
      })

      return { success: true, count }
    } catch (error) {
      console.error('Error counting unread notifications:', error)
      return { success: false, count: 0 }
    }
  }

  /**
   * Supprimer les notifications anciennes (cleanup)
   */
  static async deleteOldNotifications(daysOld: number = 90) {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      await prisma.notification.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
          isRead: true,
        },
      })

      return { success: true }
    } catch (error) {
      console.error('Error deleting old notifications:', error)
      return { success: false }
    }
  }
}