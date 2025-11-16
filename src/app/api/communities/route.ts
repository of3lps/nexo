import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeText } from '@/lib/sanitize'

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
    console.error('Error fetching communities:', error)
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

    if (!name?.trim() || !slug?.trim()) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    // Sanitizar inputs
    const sanitizedName = sanitizeText(name)
    const sanitizedDescription = description ? sanitizeText(description) : ''
    const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')

    // Buscar usuário para obter tenantId
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verificar se slug já existe no tenant
    const existingCommunity = await prisma.community.findUnique({
      where: { 
        slug_tenantId: {
          slug: sanitizedSlug,
          tenantId: user.tenantId
        }
      }
    })

    if (existingCommunity) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }

    const community = await prisma.community.create({
      data: {
        name: sanitizedName,
        description: sanitizedDescription,
        slug: sanitizedSlug,
        tenantId: user.tenantId,
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
    console.error('Error creating community:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}