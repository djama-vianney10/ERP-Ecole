/**
 * Fichier : src/modules/grades/services/grade.service.ts
 * Rôle : Service métier pour la gestion des notes
 * Architecture : Business logic layer avec validation
 */

import { GradeRepository, CreateGradeData, GradeFilters } from '../data/grade.repository'
import { EventDispatcher } from '@/modules/notifications/services/event-dispatcher.service'
import { RBACService } from '@/modules/auth/services/rbac.service'
import { UserRole } from '@prisma/client'
import type { AuthUser } from '@/modules/auth/types/auth.types'

export class GradeService {
  /**
   * Créer une nouvelle note avec notification
   */
  static async createGrade(data: CreateGradeData, user: AuthUser) {
    try {
      // Vérification des permissions
      if (!RBACService.hasPermission(user.role, 'create', 'grade')) {
        throw new Error('Permission refusée')
      }

      // Validation des données
      if (data.score < 0 || data.score > (data.maxScore || 20)) {
        throw new Error('Note invalide')
      }

      // Si c'est un enseignant, vérifier qu'il enseigne cette matière à cet élève
      if (user.role === UserRole.TEACHER && user.profileId !== data.teacherId) {
        throw new Error('Vous ne pouvez créer que vos propres notes')
      }

      // Créer la note
      const grade = await GradeRepository.create(data)

      // Déclencher l'événement de notification
      await EventDispatcher.onNewGrade(grade.id)

      return { success: true, grade }
    } catch (error: any) {
      console.error('Error creating grade:', error)
      return { success: false, error: error.message || 'Erreur lors de la création de la note' }
    }
  }

  /**
   * Récupérer les notes avec filtres
   */
  static async getGrades(filters: GradeFilters, user: AuthUser) {
    try {
      // Appliquer les filtres selon le rôle
      const finalFilters = { ...filters }

      if (user.role === UserRole.STUDENT) {
        // Un élève ne peut voir que ses propres notes
        finalFilters.studentId = user.id
      } else if (user.role === UserRole.TEACHER) {
        // Un enseignant ne peut voir que les notes qu'il a créées
        finalFilters.teacherId = user.profileId
      }

      const grades = await GradeRepository.findMany(finalFilters)

      return { success: true, grades }
    } catch (error: any) {
      console.error('Error fetching grades:', error)
      return { success: false, grades: [], error: error.message }
    }
  }

  /**
   * Récupérer une note par ID
   */
  static async getGradeById(id: string, user: AuthUser) {
    try {
      const grade = await GradeRepository.findById(id)

      if (!grade) {
        return { success: false, error: 'Note non trouvée' }
      }

      // Vérifier les permissions d'accès
      const canAccess = this.canAccessGrade(grade, user)
      if (!canAccess) {
        return { success: false, error: 'Accès refusé' }
      }

      return { success: true, grade }
    } catch (error: any) {
      console.error('Error fetching grade:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Mettre à jour une note
   */
  static async updateGrade(id: string, data: Partial<CreateGradeData>, user: AuthUser) {
    try {
      // Vérifier que la note existe
      const existingGrade = await GradeRepository.findById(id)
      if (!existingGrade) {
        return { success: false, error: 'Note non trouvée' }
      }

      // Vérifier les permissions
      if (user.role === UserRole.TEACHER && existingGrade.teacherId !== user.profileId) {
        return { success: false, error: 'Vous ne pouvez modifier que vos propres notes' }
      }

      if (!RBACService.hasPermission(user.role, 'update', 'grade')) {
        return { success: false, error: 'Permission refusée' }
      }

      // Mise à jour
      const grade = await GradeRepository.update(id, data)

      return { success: true, grade }
    } catch (error: any) {
      console.error('Error updating grade:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Supprimer une note
   */
  static async deleteGrade(id: string, user: AuthUser) {
    try {
      const existingGrade = await GradeRepository.findById(id)
      if (!existingGrade) {
        return { success: false, error: 'Note non trouvée' }
      }

      // Seuls les admins et le prof qui a créé la note peuvent la supprimer
      if (
        user.role !== UserRole.ADMIN &&
        user.role !== UserRole.PRINCIPAL &&
        existingGrade.teacherId !== user.profileId
      ) {
        return { success: false, error: 'Permission refusée' }
      }

      await GradeRepository.delete(id)

      return { success: true }
    } catch (error: any) {
      console.error('Error deleting grade:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Vérifier si un utilisateur peut accéder à une note
   */
  private static canAccessGrade(grade: any, user: AuthUser): boolean {
    // Admin/Principal peuvent tout voir
    if (RBACService.isAdminRole(user.role)) {
      return true
    }

    // L'enseignant qui a créé la note
    if (user.role === UserRole.TEACHER && grade.teacherId === user.profileId) {
      return true
    }

    // L'élève concerné
    if (user.role === UserRole.STUDENT && grade.studentId === user.id) {
      return true
    }

    // Les parents de l'élève (logique simplifiée ici)
    if (user.role === UserRole.PARENT) {
      // Cette vérification devrait inclure une requête pour vérifier la relation parent-enfant
      return true
    }

    return false
  }

  /**
   * Obtenir les statistiques d'une classe
   */
  static async getClassStats(classId: string, subjectId: string, academicYearId: string, period: string) {
    try {
      const stats = await GradeRepository.getClassStatsBySubject(
        classId,
        subjectId,
        academicYearId,
        period as any
      )

      return { success: true, stats }
    } catch (error: any) {
      console.error('Error getting class stats:', error)
      return { success: false, error: error.message }
    }
  }
}