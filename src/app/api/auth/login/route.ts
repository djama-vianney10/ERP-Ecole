/**
 * Fichier : src/app/api/auth/login/route.ts
 * Rôle : API Route pour la connexion utilisateur
 * Architecture : Next.js App Router API
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { AuthService } from '@/modules/auth/services/auth.service'

// Schéma de validation Zod
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation des données
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error.errors[0].message 
        },
        { status: 400 }
      )
    }

    // Authentification
    const result = await AuthService.login(validation.data)

    if (!result.success) {
      return NextResponse.json(result, { status: 401 })
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Login API error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}