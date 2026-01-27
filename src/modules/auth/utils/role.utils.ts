import { UserRole } from '@prisma/client'

/**
 * Vérifie si un rôle fait partie des rôles autorisés
 * Type-safe et réutilisable (Web + API + Mobile)
 */
export function hasRole(
  role: UserRole,
  allowedRoles: readonly UserRole[]
): boolean {
  return allowedRoles.includes(role)
}
