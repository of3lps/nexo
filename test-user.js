const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testCreateUser() {
  try {
    // Verificar se existe tenant demo
    let tenant = await prisma.tenant.findUnique({
      where: { slug: 'demo' }
    })

    // Se não existir, criar o tenant demo
    if (!tenant) {
      console.log('Criando tenant demo...')
      tenant = await prisma.tenant.create({
        data: {
          name: 'Demo Tenant',
          slug: 'demo'
        }
      })
      console.log('Tenant demo criado:', tenant)
    } else {
      console.log('Tenant demo encontrado:', tenant)
    }

    // Testar criação via API
    console.log('\nTestando criação de usuário via API...')
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Usuário Teste',
        email: 'teste@exemplo.com',
        password: '123456'
      })
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Usuário criado com sucesso:', result)
    } else {
      console.log('❌ Erro ao criar usuário:', result)
    }

  } catch (error) {
    console.error('Erro:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCreateUser()