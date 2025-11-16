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
    const { registrationForm } = body

    const event = await prisma.event.update({
      where: { 
        id: params.id,
        organizerId: session.user.id
      },
      data: {
        registrationForm: registrationForm
      }
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error updating form:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}