import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sanitizeText } from '@/lib/sanitize'

export async function POST(request: NextRequest) {
  try {
    const { name, slug, email, password, adminName, plan } = await request.json()

    if (!name || !slug || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedName = sanitizeText(name)
    const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '')

    // Check if tenant slug already exists
    const existingTenant = await prisma.tenant.findUnique({
      where: { slug: sanitizedSlug }
    })

    if (existingTenant) {
      return NextResponse.json({ error: 'Este nome já está em uso' }, { status: 409 })
    }



    // Create tenant with admin user
    const tenant = await prisma.tenant.create({
      data: {
        name: sanitizedName,
        slug: sanitizedSlug,
        plan: plan || 'STARTER',
        users: {
          create: {
            email,
            password, // Should be hashed in production
            name: adminName || sanitizedName,
            role: 'TENANT_ADMIN'
          }
        },
        communities: {
          create: {
            name: 'Comunidade Geral',
            slug: 'geral',
            description: 'Bem-vindo à sua comunidade!',
            channels: {
              create: [
                { name: 'geral', description: 'Discussões gerais' },
                { name: 'anuncios', description: 'Anúncios importantes' }
              ]
            }
          }
        }
      },
      include: {
        users: true
      }
    })

    return NextResponse.json({ tenant }, { status: 201 })
  } catch (error) {
    console.error('Error creating tenant:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}