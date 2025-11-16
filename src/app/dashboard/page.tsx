'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Sidebar from '@/components/Sidebar'
import { 
  Users, Calendar, TrendingUp, DollarSign, 
  MessageSquare, Eye, ArrowUp, ArrowDown,
  Sparkles, Bell, Search, Filter
} from 'lucide-react'

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState('overview')
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)
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
      }
    } catch (error) {
      console.error('Error fetching communities:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      label: 'Total Members',
      value: communities.reduce((acc, c: any) => acc + (c._count?.members || 0), 0).toString(),
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Active Events',
      value: communities.reduce((acc, c: any) => acc + (c._count?.events || 0), 0).toString(),
      change: '+5%',
      trend: 'up',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Communities',
      value: communities.length.toString(),
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'Engagement Rate',
      value: '68%',
      change: '-3%',
      trend: 'down',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600'
    }
  ]

  const recentActivity = [
    {
      type: 'member',
      message: 'New member joined the community',
      time: '2 minutes ago',
      avatar: '👩💻'
    },
    {
      type: 'event',
      message: 'New event was created',
      time: '15 minutes ago',
      avatar: '📅'
    },
    {
      type: 'post',
      message: 'New post in General Discussion',
      time: '1 hour ago',
      avatar: '👨💼'
    }
  ]

  const upcomingEvents = [
    {
      title: 'Workshop',
      date: 'Tomorrow, 2:00 PM',
      attendees: 45,
      status: 'confirmed'
    },
    {
      title: 'Community Meetup',
      date: 'Friday, 6:00 PM',
      attendees: 78,
      status: 'confirmed'
    }
  ]

  return (
    <div className="flex h-screen bg-nexo-lightGray">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-nexo-lightGray px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-nexo-navy">Dashboard Overview</h1>
              <p className="text-nexo-mediumGray mt-1">Welcome back! Here's what's happening in your community.</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-nexo-mediumGray" />
                <input 
                  type="text" 
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                />
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-xl relative">
                <Bell className="w-5 h-5 text-slate-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-semibold">JD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="glass-card p-6 rounded-2xl animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center space-x-1 text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
                    <p className="text-slate-600 text-sm">{stat.label}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-slate-900">Recent Activity</h3>
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 hover:bg-slate-50 rounded-xl transition-colors">
                      <div className="text-2xl">{activity.avatar}</div>
                      <div className="flex-1">
                        <p className="text-slate-900 font-medium">{activity.message}</p>
                        <p className="text-slate-500 text-sm">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <div className="glass-card p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-slate-900">Upcoming Events</h3>
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    Create Event
                  </button>
                </div>
                
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-xl hover:border-primary-300 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-slate-900">{event.title}</h4>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'confirmed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {event.status}
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm mb-2">{event.date}</p>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">{event.attendees} attending</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-nexo-navy mb-6">Quick Actions</h3>
              {communities.length === 0 ? (
                <div className="text-center py-8">
                  <Sparkles className="w-16 h-16 text-nexo-mediumGray mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-nexo-navy mb-2">Create Your First Community</h4>
                  <p className="text-nexo-mediumGray mb-6">Get started by creating your first community</p>
                  <a href="/dashboard/create-community" className="btn-primary">
                    Create Community
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="p-4 border-2 border-dashed border-nexo-lightGray rounded-xl hover:border-nexo-orange hover:bg-nexo-orange/5 transition-all group">
                    <Calendar className="w-8 h-8 text-nexo-mediumGray group-hover:text-nexo-orange mx-auto mb-2" />
                    <span className="text-sm font-medium text-nexo-mediumGray group-hover:text-nexo-orange">Create Event</span>
                  </button>
                  <button className="p-4 border-2 border-dashed border-nexo-lightGray rounded-xl hover:border-nexo-orange hover:bg-nexo-orange/5 transition-all group">
                    <MessageSquare className="w-8 h-8 text-nexo-mediumGray group-hover:text-nexo-orange mx-auto mb-2" />
                    <span className="text-sm font-medium text-nexo-mediumGray group-hover:text-nexo-orange">New Post</span>
                  </button>
                  <button className="p-4 border-2 border-dashed border-nexo-lightGray rounded-xl hover:border-nexo-orange hover:bg-nexo-orange/5 transition-all group">
                    <Users className="w-8 h-8 text-nexo-mediumGray group-hover:text-nexo-orange mx-auto mb-2" />
                    <span className="text-sm font-medium text-nexo-mediumGray group-hover:text-nexo-orange">Invite Members</span>
                  </button>
                  <a href="/dashboard/create-community" className="p-4 border-2 border-dashed border-nexo-lightGray rounded-xl hover:border-nexo-orange hover:bg-nexo-orange/5 transition-all group">
                    <Sparkles className="w-8 h-8 text-nexo-mediumGray group-hover:text-nexo-orange mx-auto mb-2" />
                    <span className="text-sm font-medium text-nexo-mediumGray group-hover:text-nexo-orange">New Community</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}