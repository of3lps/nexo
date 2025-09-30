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
    const channelId = searchParams.get('channelId')

    const posts = await prisma.post.findMany({
      where: channelId ? { channelId } : {},
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            comments: true,
            reactions: true
          }
        }
      },
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, channelId, attachments } = body

    if ((!content?.trim() && !attachments?.length) || !channelId) {
      return NextResponse.json({ error: 'Content or attachments and channelId are required' }, { status: 400 })
    }

    // Verificar se o canal existe e o usuário tem acesso
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      include: {
        community: {
          include: {
            members: {
              where: { userId: session.user.id }
            }
          }
        }
      }
    })

    if (!channel || channel.community.members.length === 0) {
      return NextResponse.json({ error: 'Channel not found or access denied' }, { status: 403 })
    }

    const post = await prisma.post.create({
      data: {
        content: content?.trim() || '',
        channelId,
        authorId: session.user.id,
        attachments: attachments || []
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        _count: {
          select: {
            comments: true,
            reactions: true
          }
        }
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}