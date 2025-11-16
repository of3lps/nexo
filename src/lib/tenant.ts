import { NextRequest } from 'next/server'
import { prisma } from './prisma'

export async function getTenantFromRequest(request: NextRequest) {
  const host = request.headers.get('host')
  
  if (!host) return null

  // Check for custom domain first
  let tenant = await prisma.tenant.findFirst({
    where: { domain: host }
  })

  // If not found, check for subdomain
  if (!tenant) {
    const subdomain = host.split('.')[0]
    if (subdomain && subdomain !== 'www') {
      tenant = await prisma.tenant.findFirst({
        where: { slug: subdomain }
      })
    }
  }

  return tenant
}

export function getTenantSlug(host: string): string | null {
  if (!host) return null
  
  const parts = host.split('.')
  if (parts.length > 2) {
    return parts[0] // subdomain
  }
  
  return null
}