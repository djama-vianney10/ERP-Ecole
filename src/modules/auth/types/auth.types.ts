/**
 * Fichier : src/modules/auth/types/auth.types.ts
 * Rôle : Types TypeScript pour l'authentification et RBAC
 * Architecture : Contrat de types centralisé pour la sécurité
 */

import { UserRole, UserStatus } from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  status: UserStatus
  profileId?: string // ID du profil (Teacher, Student, Parent)
  firstName?: string
  lastName?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  phone?: string
  role: UserRole
  firstName: string
  lastName: string
  // Champs spécifiques selon le rôle
  metadata?: Record<string, any>
}

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  iat?: number
  exp?: number
}

export interface AuthResponse {
  success: boolean
  user?: AuthUser
  token?: string
  error?: string
}

export interface Permission {
  action: string // Ex: 'create', 'read', 'update', 'delete'
  resource: string // Ex: 'grade', 'student', 'class'
}

// Mapping des permissions par rôle (RBAC)
export const RolePermissions: Record<UserRole, Permission[]> = {
  ADMIN: [
    { action: '*', resource: '*' }, // Tous les droits
  ],
  PRINCIPAL: [
    { action: '*', resource: 'user' },
    { action: '*', resource: 'student' },
    { action: '*', resource: 'teacher' },
    { action: '*', resource: 'class' },
    { action: 'read', resource: 'grade' },
    { action: 'read', resource: 'attendance' },
  ],
  ACADEMIC_HEAD: [
    { action: 'read', resource: 'user' },
    { action: '*', resource: 'student' },
    { action: 'read', resource: 'teacher' },
    { action: '*', resource: 'class' },
    { action: '*', resource: 'schedule' },
    { action: '*', resource: 'attendance' },
  ],
  TEACHER: [
    { action: 'read', resource: 'student' },
    { action: 'read', resource: 'class' },
    { action: '*', resource: 'grade' }, // Limité à ses classes
    { action: '*', resource: 'attendance' }, // Limité à ses classes
    { action: 'read', resource: 'schedule' },
  ],
  STUDENT: [
    { action: 'read', resource: 'grade' }, // Ses propres notes
    { action: 'read', resource: 'attendance' }, // Sa propre assiduité
    { action: 'read', resource: 'schedule' },
    { action: 'read', resource: 'notification' },
  ],
  PARENT: [
    { action: 'read', resource: 'grade' }, // Notes de ses enfants
    { action: 'read', resource: 'attendance' }, // Assiduité de ses enfants
    { action: 'read', resource: 'schedule' },
    { action: 'read', resource: 'notification' },
  ],
  ACCOUNTANT: [
    { action: 'read', resource: 'student' },
    { action: '*', resource: 'payment' }, // Module futur
  ],
}

export interface SessionUser {
  id: string
  email: string
  role: UserRole
  profileId?: string
}