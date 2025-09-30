import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const communityId = searchParams.get('communityId')

    if (!communityId) {
      return NextResponse.json({ error: 'Community ID required' }, { status: 400 })
    }

    const membership = await prisma.communityMember.findFirst({
      where: {
        communityId,
        userId: session.user.id
      }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Not a member of this community' }, { status: 403 })
    }

    // Get all channels for the community first
    const allChannels = await prisma.channel.findMany({
      where: { communityId },
      include: {
        members: {
          select: {
            userId: true
          }
        },
        _count: {
          select: {
            members: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    // Filter channels based on privacy and membership
    const channels = allChannels.filter(channel => {
      if (!channel.isPrivate) return true
      return channel.members.some(member => member.userId === session.user.id)
    })

    return NextResponse.json(channels)
  } catch (error) {
    console.error('Error in GET /api/channels:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Creating channel with data:', body)
    const { name, description, communityId, isPrivate, memberIds } = body

    if (!name || !communityId) {
      return NextResponse.json({ error: 'Name and communityId are required' }, { status: 400 })
    }

    const membership = await prisma.communityMember.findFirst({
      where: {
        communityId,
        userId: session.user.id,
        role: { in: ['OWNER', 'ADMIN'] }
      }
    })

    if (!membership) {
      return NextResponse.json({ error: 'Not authorized to create channels' }, { status: 403 })
    }

    const channel = await prisma.channel.create({
      data: {
        name,
        description,
        communityId,
        isPrivate: isPrivate || false
      }
    })

    // Add members to private channel
    if (isPrivate && memberIds && memberIds.length > 0) {
      await prisma.channelMember.createMany({
        data: memberIds.map((userId: string) => ({
          userId,
          channelId: channel.id
        }))
      })
    }

    console.log('Channel created:', channel)
    return NextResponse.json(channel, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/channels:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}