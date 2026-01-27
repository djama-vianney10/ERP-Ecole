/**
 * Fichier : src/modules/auth/services/rbac.service.ts
 * Rôle : Service de contrôle d'accès basé sur les rôles (RBAC)
 * Architecture : Gestion granulaire des permissions
 */

import { UserRole } from '@prisma/client'
import { RolePermissions, type Permission, type AuthUser } from '../types/auth.types'

export class RBACService {
  /**
   * Vérifier si un rôle a une permission spécifique
   */
  static hasPermission(
    role: UserRole,
    action: string,
    resource: string
  ): boolean {
    const permissions = RolePermissions[role] || []

    // Vérifier les permissions wildcard (admin)
    const hasWildcard = permissions.some(
      (p) => p.action === '*' && p.resource === '*'
    )
    if (hasWildcard) return true

    // Vérifier les permissions exactes
    const hasExact = permissions.some(
      (p) =>
        (p.action === action || p.action === '*') &&
        (p.resource === resource || p.resource === '*')
    )

    return hasExact
  }

  /**
   * Vérifier si un utilisateur peut accéder à une ressource
   */
  static canAccess(
    user: AuthUser,
    action: string,
    resource: string,
    ownerId?: string
  ): boolean {
    // Vérification de base par rôle
    const hasRolePermission = this.hasPermission(user.role, action, resource)

    // Pour les enseignants/étudiants/parents : vérifier la propriété
    if (user.role === UserRole.TEACHER && ownerId) {
      return hasRolePermission && user.profileId === ownerId
    }

    if (user.role === UserRole.STUDENT && ownerId) {
      return hasRolePermission && user.id === ownerId
    }

    if (user.role === UserRole.PARENT && ownerId) {
      // Les parents peuvent accéder aux ressources de leurs enfants
      // Cette logique sera complétée avec une requête DB dans le middleware
      return hasRolePermission
    }

    return hasRolePermission
  }

  /**
   * Obtenir toutes les permissions d'un rôle
   */
  static getRolePermissions(role: UserRole): Permission[] {
    return RolePermissions[role] || []
  }

  /**
   * Vérifier si un rôle est administratif
   */
  static isAdminRole(role: UserRole): boolean {
  const adminRoles: readonly UserRole[] = [
    UserRole.ADMIN,
    UserRole.PRINCIPAL,
    UserRole.ACADEMIC_HEAD,
  ]

  return adminRoles.includes(role)
}

  /**
   * Vérifier si un utilisateur peut gérer un autre utilisateur
   */
  static canManageUser(managerRole: UserRole, targetRole: UserRole): boolean {
  if (managerRole === UserRole.ADMIN) return true

  if (managerRole === UserRole.PRINCIPAL) {
    return targetRole !== UserRole.ADMIN
  }

  if (managerRole === UserRole.ACADEMIC_HEAD) {
    const manageableRoles: UserRole[] = [
      UserRole.TEACHER,
      UserRole.STUDENT,
    ]

    return manageableRoles.includes(targetRole)
  }

  return false
}

  /**
   * Obtenir les rôles accessibles pour création par un rôle donné
   */
  static getCreatableRoles(role: UserRole): UserRole[] {
    switch (role) {
      case UserRole.ADMIN:
        return Object.values(UserRole)
      
      case UserRole.PRINCIPAL:
        return [
          UserRole.ACADEMIC_HEAD,
          UserRole.TEACHER,
          UserRole.STUDENT,
          UserRole.PARENT,
          UserRole.ACCOUNTANT,
        ]
      
      case UserRole.ACADEMIC_HEAD:
        return [UserRole.STUDENT, UserRole.PARENT]
      
      default:
        return []
    }
  }
}