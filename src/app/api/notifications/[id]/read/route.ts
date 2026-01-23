/**
 * Fichier : src/app/api/notifications/[id]/read/route.ts
 * Rôle : Marquer une notification comme lue
 * Architecture : Endpoint PATCH protégé
 */

import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/modules/auth/middleware/auth.middleware'
import { NotificationService } from '@/modules/notifications/services/notification.service'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error } = await authenticateRequest(request)
    if (error || !user) return error || NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const result = await NotificationService.markAsRead(params.id, user.id)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, notification: result.notification })
  } catch (error) {
    console.error('Mark as read API error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}