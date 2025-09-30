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

    const communities = await prisma.community.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id
          }
        }
      },
      include: {
        _count: {
          select: {
            members: true,
            events: true
          }
        }
      }
    })

    return NextResponse.json(communities)
  } catch (error) {
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
    const { name, description, slug } = body

    const community = await prisma.community.create({
      data: {
        name,
        description,
        slug,
        members: {
          create: {
            userId: session.user.id,
            role: 'OWNER'
          }
        },
        channels: {
          create: [
            { name: 'general', description: 'General discussion' },
            { name: 'announcements', description: 'Important announcements' }
          ]
        }
      },
      include: {
        _count: {
          select: {
            members: true,
            events: true
          }
        }
      }
    })

    return NextResponse.json(community, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}