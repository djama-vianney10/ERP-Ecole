/**
 * Fichier : src/modules/auth/middleware/auth.middleware.ts
 * Rôle : Middleware de vérification d'authentification pour les API Routes
 * Architecture : Protection des endpoints Next.js
 */

import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '../services/auth.service'
import { RBACService } from '../services/rbac.service'
import type { AuthUser } from '../types/auth.types'

export interface AuthenticatedRequest extends NextRequest {
  user?: AuthUser
}

/**
 * Middleware de vérification du token JWT
 */
export async function authenticateRequest(
  request: NextRequest
): Promise<{ user: AuthUser | null; error: NextResponse | null }> {
  try {
    // Extraction du token depuis le header Authorization
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        user: null,
        error: NextResponse.json(
          { error: 'Token d\'authentification manquant' },
          { status: 401 }
        ),
      }
    }

    const token = authHeader.substring(7) // Retire "Bearer "

    // Vérification du token
    const user = await AuthService.getUserFromToken(token)

    if (!user) {
      return {
        user: null,
        error: NextResponse.json(
          { error: 'Token invalide ou expiré' },
          { status: 401 }
        ),
      }
    }

    return { user, error: null }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      user: null,
      error: NextResponse.json(
        { error: 'Erreur d\'authentification' },
        { status: 500 }
      ),
    }
  }
}

/**
 * Middleware de vérification des permissions RBAC
 */
export function requirePermission(action: string, resource: string) {
  return (user: AuthUser): NextResponse | null => {
    const hasPermission = RBACService.hasPermission(user.role, action, resource)

    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Accès refusé. Permissions insuffisantes.' },
        { status: 403 }
      )
    }

    return null
  }
}

/**
 * Middleware de vérification de rôle spécifique
 */
export function requireRole(...allowedRoles: string[]) {
  return (user: AuthUser): NextResponse | null => {
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Accès refusé. Rôle non autorisé.' },
        { status: 403 }
      )
    }

    return null
  }
}

/**
 * Helper pour combiner authentification + permission
 */
export async function withAuth(
  request: NextRequest,
  options?: {
    action?: string
    resource?: string
    roles?: string[]
  }
): Promise<{ user: AuthUser | null; error: NextResponse | null }> {
  // Vérification authentification
  const { user, error } = await authenticateRequest(request)
  
  if (error || !user) {
    return { user: null, error }
  }

  // Vérification des rôles si spécifié
  if (options?.roles) {
    const roleError = requireRole(...options.roles)(user)
    if (roleError) {
      return { user: null, error: roleError }
    }
  }

  // Vérification des permissions si spécifié
  if (options?.action && options?.resource) {
    const permError = requirePermission(options.action, options.resource)(user)
    if (permError) {
      return { user: null, error: permError }
    }
  }

  return { user, error: null }
}