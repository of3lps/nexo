import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { formData } = body

    const existingAttendee = await prisma.eventAttendee.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: params.id
        }
      }
    })

    if (existingAttendee) {
      return NextResponse.json({ error: 'Already registered' }, { status: 400 })
    }

    const attendee = await prisma.eventAttendee.create({
      data: {
        userId: session.user.id,
        eventId: params.id,
        formData: formData || {}
      }
    })

    return NextResponse.json(attendee, { status: 201 })
  } catch (error) {
    console.error('Error registering for event:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.eventAttendee.delete({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId: params.id
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unregistering from event:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}