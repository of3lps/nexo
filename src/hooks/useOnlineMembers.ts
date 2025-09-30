'use client'

import { useState, useEffect } from 'react'

interface OnlineMember {
  id: string
  name: string
  email: string
  avatar?: string
}

export function useOnlineMembers(communityId: string | null) {
  const [onlineMembers, setOnlineMembers] = useState<OnlineMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!communityId) {
      setOnlineMembers([])
      setLoading(false)
      return
    }

    const fetchOnlineMembers = async () => {
      try {
        const response = await fetch(`/api/communities/${communityId}/members?status=online`)
        if (response.ok) {
          const data = await response.json()
          setOnlineMembers(data)
        }
      } catch (error) {
        console.error('Error fetching online members:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOnlineMembers()

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchOnlineMembers, 30000)

    return () => clearInterval(interval)
  }, [communityId])

  return { onlineMembers, loading }
}