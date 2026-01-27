import { NextRequest, NextResponse } from 'next/server'
import prisma  from '@/shared/lib/prisma'
import { authenticateRequest } from '@/modules/auth/middleware/auth.middleware'
import { UserRole } from '@prisma/client'
import { RBACService } from '@/modules/auth/services/rbac.service'

// GET - Liste des événements
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request)
    if (error || !user) return error || NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    if (!RBACService.isAdminRole(user.role)) {
  return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
}

    const events = await prisma.event.findMany({
      orderBy: { eventDate: 'desc' }
    })

    return NextResponse.json({ success: true, events })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Créer un événement
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request)
    if (error || !user) return error || NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    if (!RBACService.isAdminRole(user.role)) {
  return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
}

    const body = await request.json()
    const { title, description, eventDate, endDate, type, imageUrl, isActive } = body

    const event = await prisma.event.create({
      data: {
        title,
        description,
        eventDate: new Date(eventDate),
        endDate: endDate ? new Date(endDate) : null,
        type,
        imageUrl,
        isActive: isActive !== undefined ? isActive : true,
        createdBy: user.id,
      }
    })

    return NextResponse.json({ success: true, event }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}