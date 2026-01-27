import { NextRequest, NextResponse } from 'next/server'
import { put, del } from '@vercel/blob'
import { authenticateRequest } from '@/modules/auth/middleware/auth.middleware'
import { UserRole } from '@prisma/client'
import { RBACService } from '@/modules/auth/services/rbac.service'

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request)
    if (error || !user) return error || NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    if (!RBACService.isAdminRole(user.role)) {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })
    }

    // Validation
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Type non autorisé' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 5MB)' }, { status: 400 })
    }

    // Upload vers Vercel Blob
    const filename = `events/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename: blob.pathname,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Erreur upload' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request)
    if (error || !user) return error || NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json({ error: 'URL manquante' }, { status: 400 })
    }

    await del(url)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 })
  }
}