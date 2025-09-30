import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type } = body

    if (type !== 'LIKE') {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 })
    }

    // Verificar se o post existe
    const post = await prisma.post.findUnique({
      where: { id: params.id }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const existingReaction = await prisma.reaction.findFirst({
      where: {
        postId: params.id,
        userId: session.user.id,
        type: 'LIKE'
      }
    })

    if (existingReaction) {
      await prisma.reaction.delete({
        where: { id: existingReaction.id }
      })
    } else {
      await prisma.reaction.create({
        data: {
          postId: params.id,
          userId: session.user.id,
          type: 'LIKE'
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error handling reaction:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}