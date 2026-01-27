import { NextRequest, NextResponse } from 'next/server'
import  prisma  from '@/shared/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      where: {
        isActive: true,
        eventDate: { gte: new Date() }
      },
      orderBy: { eventDate: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        eventDate: true,
        endDate: true,
        type: true,
        imageUrl: true,
      }
    })

    return NextResponse.json({
      success: true,
      events
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}