/**
 * Fichier : src/app/api/notifications/route.ts
 * Rôle : API Routes pour récupérer les notifications
 * Architecture : Endpoint protégé avec pagination
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/modules/auth/middleware/auth.middleware'
import { NotificationService } from '@/modules/notifications/services/notification.service'

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request)
    if (error || !user) return error || NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    const result = await NotificationService.getUserNotifications(user.id, {
      limit,
      unreadOnly,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des notifications' },
        { status: 500 }
      )
    }

    return NextResponse.json({ notifications: result.notifications })
  } catch (error) {
    console.error('Notifications API error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}