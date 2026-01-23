/**
 * Fichier : src/app/api/auth/register/route.ts
 * Rôle : API Route pour l'inscription de nouveaux utilisateurs
 * Architecture : Next.js App Router API avec RBAC
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AuthService } from '@/modules/auth/services/auth.service'
import { withAuth } from '@/modules/auth/middleware/auth.middleware'
import { UserRole } from '@prisma/client'

// Schéma de validation
const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  metadata: z.record(z.any()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Vérification des permissions (seul admin/principal peuvent créer des comptes)
    const { user, error } = await withAuth(request, {
      roles: [UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.ACADEMIC_HEAD],
    })

    if (error) return error

    const body = await request.json()

    // Validation
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    // Création du compte
    const result = await AuthService.register(validation.data)

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Register API error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}