import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { abacatepay } from '@/lib/abacatepay'

const PLAN_IDS = {
  STARTER: 'starter_monthly',
  PRO: 'pro_monthly', 
  ENTERPRISE: 'enterprise_monthly'
}

export async function POST(request: NextRequest) {
  try {
    const { tenantId, plan } = await request.json()

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { users: { where: { role: 'TENANT_ADMIN' }, take: 1 } }
    })

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const admin = tenant.users[0]
    
    // 1. Criar customer no AbacatePay
    const customer = await abacatepay.createCustomer({
      name: admin.name || tenant.name,
      email: admin.email
    })

    // 2. Criar checkout
    const checkout = await abacatepay.createCheckout({
      customer_id: customer.id,
      plan_id: PLAN_IDS[plan as keyof typeof PLAN_IDS],
      success_url: `${process.env.NEXTAUTH_URL}/onboarding/success?tenant=${tenant.slug}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/onboarding?step=3`,
      trial_days: 14
    })

    // 3. Salvar customer ID
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { 
        customerId: customer.id,
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 dias
      }
    })

    return NextResponse.json({ checkout_url: checkout.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}