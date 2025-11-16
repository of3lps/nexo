const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Setting up database...')

  // Create demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'Demo Company',
      slug: 'demo',
      plan: 'PRO',
      status: 'ACTIVE'
    }
  })

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const user = await prisma.user.upsert({
    where: { 
      email_tenantId: {
        email: 'admin@demo.com',
        tenantId: tenant.id
      }
    },
    update: {},
    create: {
      email: 'admin@demo.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'TENANT_ADMIN',
      tenantId: tenant.id
    }
  })

  // Create default community
  const community = await prisma.community.upsert({
    where: {
      slug_tenantId: {
        slug: 'general',
        tenantId: tenant.id
      }
    },
    update: {},
    create: {
      name: 'General Community',
      slug: 'general',
      description: 'Welcome to your community!',
      tenantId: tenant.id,
      members: {
        create: {
          userId: user.id,
          role: 'OWNER'
        }
      },
      channels: {
        create: [
          {
            name: 'general',
            description: 'General discussion'
          },
          {
            name: 'announcements',
            description: 'Important announcements'
          }
        ]
      }
    }
  })

  console.log('✅ Database setup complete!')
  console.log('📧 Login: admin@demo.com')
  console.log('🔑 Password: admin123')
  console.log('🌐 URL: http://demo.localhost:3000')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })