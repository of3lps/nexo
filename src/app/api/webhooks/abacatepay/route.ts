import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-abacatepay-signature')
    
    // Verificar assinatura do webhook
    const expectedSignature = crypto
      .createHmac('sha256', process.env.ABACATEPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex')
    
    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)
    
    switch (event.type) {
      case 'subscription.created':
        await handleSubscriptionCreated(event.data)
        break
        
      case 'subscription.paid':
        await handleSubscriptionPaid(event.data)
        break
        
      case 'subscription.payment_failed':
        await handlePaymentFailed(event.data)
        break
        
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.data)
        break
        
      default:
        console.log('Unhandled webhook event:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}

async function handleSubscriptionCreated(data: any) {
  await prisma.tenant.update({
    where: { customerId: data.customer_id },
    data: {
      subscriptionId: data.id,
      status: 'TRIAL'
    }
  })
}

async function handleSubscriptionPaid(data: any) {
  await prisma.tenant.update({
    where: { subscriptionId: data.id },
    data: {
      status: 'ACTIVE'
    }
  })
}

async function handlePaymentFailed(data: any) {
  await prisma.tenant.update({
    where: { subscriptionId: data.id },
    data: {
      status: 'PAYMENT_FAILED'
    }
  })
}

async function handleSubscriptionCancelled(data: any) {
  await prisma.tenant.update({
    where: { subscriptionId: data.id },
    data: {
      status: 'CANCELLED'
    }
  })
}