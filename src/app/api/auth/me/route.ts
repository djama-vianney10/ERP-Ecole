/**
 * Fichier : src/app/api/auth/me/route.ts
 * Rôle : API Route pour récupérer les infos de l'utilisateur connecté
 * Architecture : Endpoint protégé pour refresh user data
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/modules/auth/middleware/auth.middleware'

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request)

    if (error || !user) {
      return error || NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error('Me API error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}