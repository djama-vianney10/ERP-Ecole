/**
 * Fichier : src/app/api/notifications/read-all/route.ts
 * Rôle : Marquer toutes les notifications comme lues
 * Architecture : Endpoint PATCH bulk operation
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/modules/auth/middleware/auth.middleware'
import { NotificationService } from '@/modules/notifications/services/notification.service'

export async function PATCH(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request)
    if (error || !user) return error || NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const result = await NotificationService.markAllAsRead(user.id)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Mark all as read API error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}