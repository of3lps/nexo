import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { getTenantSlug } from './lib/tenant'

export default withAuth(
  function middleware(req) {
    const host = req.headers.get('host') || ''
    const tenantSlug = getTenantSlug(host)
    
    if (tenantSlug) {
      const response = NextResponse.next()
      response.headers.set('x-tenant-slug', tenantSlug)
      return response
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*']
}