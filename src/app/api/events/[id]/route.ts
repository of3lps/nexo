import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, date, location, maxAttendees, price, registrationForm } = body

    const event = await prisma.event.update({
      where: { 
        id: params.id,
        organizerId: session.user.id
      },
      data: {
        title: title?.trim(),
        description: description?.trim() || null,
        date: new Date(date),
        location: location?.trim() || null,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        price: price?.trim() || null,
        ...(registrationForm && { registrationForm: JSON.parse(JSON.stringify(registrationForm)) })
      }
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.event.delete({
      where: { 
        id: params.id,
        organizerId: session.user.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}