'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      window.location.href = '/'
      return
    }
  }, [session, status])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-nexo-lightGray flex items-center justify-center">
        <div className="text-nexo-navy">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return <>{children}</>
}