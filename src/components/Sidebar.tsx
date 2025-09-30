'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { 
  Home, Users, Calendar, BarChart3, Settings, 
  Sparkles, ChevronLeft, ChevronRight, Plus,
  MessageSquare, Zap, Globe, LogOut
} from 'lucide-react'

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [communities, setCommunities] = useState<any[]>([])
  const [currentCommunity, setCurrentCommunity] = useState<any>(null)
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      fetchCommunities()
    }
  }, [session])

  const fetchCommunities = async () => {
    try {
      const response = await fetch('/api/communities')
      if (response.ok) {
        const data = await response.json()
        setCommunities(data)
        if (data.length > 0) {
          setCurrentCommunity(data[0])
        }
      }
    } catch (error) {
      console.error('Error fetching communities:', error)
    }
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home, href: '/dashboard' },
    { id: 'community', label: 'Community', icon: Users, href: '/dashboard/community' },
    { id: 'events', label: 'Events', icon: Calendar, href: '/dashboard/events' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
    { id: 'marketing', label: 'Marketing', icon: Zap, href: '/dashboard/marketing' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ]

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 bg-white border-r border-nexo-lightGray flex flex-col h-screen`}>
      {/* Header */}
      <div className="p-6 border-b border-nexo-lightGray">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-nexo-orange to-nexo-navy rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-nexo-navy">
                  {currentCommunity?.name || 'No Community'}
                </h2>
                <p className="text-sm text-nexo-mediumGray">
                  {currentCommunity?._count?.members || 0} members
                </p>
              </div>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-nexo-lightGray rounded-lg transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-b border-nexo-lightGray">
          <button className="w-full btn-primary text-sm py-2 px-4 flex items-center justify-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Event</span>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-nexo-orange text-white shadow-lg' 
                      : 'text-nexo-mediumGray hover:bg-nexo-lightGray hover:text-nexo-navy'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="p-4 border-t border-nexo-lightGray">
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-nexo-orange rounded-full flex items-center justify-center text-white font-semibold">
                {session?.user?.name?.[0] || 'U'}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-nexo-navy">{session?.user?.name || 'User'}</h4>
                <p className="text-sm text-nexo-mediumGray">{session?.user?.email}</p>
              </div>
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center space-x-2 text-sm text-nexo-mediumGray hover:text-nexo-navy p-2 rounded-lg hover:bg-nexo-lightGray transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}