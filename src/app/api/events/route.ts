import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const events = await prisma.event.findMany({
      where: {
        organizer: {
          tenantId: user.tenantId
        }
      },
      include: {
        creator: {
          select: { name: true }
        },
        attendees: {
          where: { userId: session.user.id },
          select: { id: true }
        },
        _count: {
          select: { attendees: true }
        }
      },
      orderBy: { date: 'asc' }
    })

    const eventsWithAttendance = events.map(event => ({
      ...event,
      isAttending: event.attendees.length > 0,
      attendees: undefined
    }))

    return NextResponse.json(eventsWithAttendance)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, date, location, maxAttendees, price, communityId } = body

    if (!title?.trim() || !date || !communityId) {
      return NextResponse.json({ error: 'Title, date and community are required' }, { status: 400 })
    }

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        date: new Date(date),
        location: location?.trim() || null,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        price: price?.trim() || null,
        organizerId: session.user.id,
        communityId
      },
      include: {
        organizer: {
          select: { name: true }
        },
        _count: {
          select: { attendees: true }
        }
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}