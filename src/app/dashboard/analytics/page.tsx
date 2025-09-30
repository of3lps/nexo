'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { 
  Users, Calendar, MessageSquare, TrendingUp, TrendingDown,
  DollarSign, Eye, Heart, Share2, Clock, Target,
  ArrowUp, ArrowDown, Activity, Zap, Award, AlertTriangle
} from 'lucide-react'

export default function AnalyticsPage() {
  const [currentPage, setCurrentPage] = useState('analytics')
  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  const kpis = [
    {
      title: 'Total Members',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      description: 'vs last month'
    },
    {
      title: 'Active Events',
      value: '23',
      change: '+8.3%',
      trend: 'up',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      description: 'this month'
    },
    {
      title: 'Engagement Rate',
      value: '68.4%',
      change: '-2.1%',
      trend: 'down',
      icon: Activity,
      color: 'from-green-500 to-green-600',
      description: 'avg daily'
    },
    {
      title: 'Monthly Revenue',
      value: 'R$ 4,892',
      change: '+18.7%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-orange-500 to-orange-600',
      description: 'vs last month'
    }
  ]

  const memberGrowthData = [
    { month: 'Jul', members: 850 },
    { month: 'Aug', members: 920 },
    { month: 'Sep', members: 1050 },
    { month: 'Oct', members: 1180 },
    { month: 'Nov', members: 1247 },
    { month: 'Dec', members: 1247 }
  ]

  const channelActivity = [
    { name: 'General', posts: 145, engagement: 78 },
    { name: 'Tech Talk', posts: 89, engagement: 92 },
    { name: 'Events', posts: 34, engagement: 85 },
    { name: 'Announcements', posts: 12, engagement: 96 }
  ]

  const eventParticipation = [
    { name: 'React Workshop', rsvp: 45, attended: 38, rate: 84 },
    { name: 'Community Meetup', rsvp: 78, attended: 65, rate: 83 },
    { name: 'Next.js Launch', rsvp: 156, attended: 142, rate: 91 },
    { name: 'Design Workshop', rsvp: 30, attended: 22, rate: 73 }
  ]

  const topPosts = [
    {
      title: 'React Workshop announcement',
      author: 'Sarah Chen',
      reactions: 45,
      comments: 23,
      views: 234,
      engagement: 92
    },
    {
      title: 'Next.js 14 performance tips',
      author: 'Mike Rodriguez',
      reactions: 38,
      comments: 19,
      views: 189,
      engagement: 87
    },
    {
      title: 'Design system best practices',
      author: 'Alex Kim',
      reactions: 31,
      comments: 15,
      views: 156,
      engagement: 79
    }
  ]

  const activeMembers = [
    { name: 'Sarah Chen', posts: 23, reactions: 145, score: 168 },
    { name: 'Mike Rodriguez', posts: 19, reactions: 98, score: 117 },
    { name: 'Alex Kim', posts: 15, reactions: 87, score: 102 },
    { name: 'Jessica Silva', posts: 12, reactions: 76, score: 88 }
  ]

  const insights = [
    {
      type: 'growth',
      icon: TrendingUp,
      title: 'Member Growth Accelerating',
      description: 'Your community grew 12.5% this month, the highest rate in 6 months.',
      action: 'Keep promoting your recent events',
      priority: 'high'
    },
    {
      type: 'engagement',
      icon: MessageSquare,
      title: 'Tech Talk Channel Thriving',
      description: 'Tech Talk has 92% engagement rate, consider creating similar channels.',
      action: 'Create specialized discussion channels',
      priority: 'medium'
    },
    {
      type: 'events',
      icon: Calendar,
      title: 'Event Attendance Declining',
      description: 'Average attendance dropped 5% compared to last month.',
      action: 'Survey members about preferred times',
      priority: 'high'
    },
    {
      type: 'content',
      icon: Heart,
      title: 'Workshop Content Performing Well',
      description: 'Educational content gets 40% more engagement than general posts.',
      action: 'Schedule more workshop announcements',
      priority: 'medium'
    }
  ]

  const activityHeatmap = [
    { day: 'Mon', hours: [2, 3, 4, 8, 12, 15, 18, 22, 25, 20, 15, 12, 8, 6, 4, 3, 2, 1, 1, 2, 3, 4, 5, 3] },
    { day: 'Tue', hours: [1, 2, 3, 6, 10, 14, 20, 28, 32, 25, 18, 15, 12, 8, 6, 4, 3, 2, 1, 2, 4, 6, 7, 4] },
    { day: 'Wed', hours: [2, 3, 4, 7, 11, 16, 22, 30, 35, 28, 20, 16, 13, 9, 7, 5, 4, 3, 2, 3, 5, 7, 8, 5] },
    { day: 'Thu', hours: [1, 2, 3, 8, 13, 18, 24, 32, 38, 30, 22, 18, 14, 10, 8, 6, 5, 4, 3, 4, 6, 8, 9, 6] },
    { day: 'Fri', hours: [3, 4, 5, 9, 14, 20, 26, 35, 40, 32, 24, 20, 16, 12, 10, 8, 7, 6, 5, 6, 8, 10, 11, 8] },
    { day: 'Sat', hours: [2, 3, 4, 6, 8, 12, 18, 25, 30, 28, 22, 18, 15, 12, 10, 8, 6, 4, 3, 4, 6, 8, 9, 6] },
    { day: 'Sun', hours: [1, 2, 2, 4, 6, 10, 15, 20, 25, 22, 18, 15, 12, 9, 7, 5, 4, 3, 2, 3, 5, 7, 8, 5] }
  ]

  const getHeatmapColor = (value: number) => {
    if (value === 0) return 'bg-nexo-lightGray'
    if (value <= 10) return 'bg-nexo-orange/20'
    if (value <= 20) return 'bg-nexo-orange/40'
    if (value <= 30) return 'bg-nexo-orange/60'
    return 'bg-nexo-orange'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-nexo-mediumGray bg-nexo-lightGray border-nexo-lightGray'
    }
  }

  return (
    <div className="flex h-screen bg-nexo-lightGray">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-nexo-lightGray px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-nexo-navy">Analytics Dashboard</h1>
              <p className="text-nexo-mediumGray mt-1">Track your community's growth and engagement</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 3 months</option>
                <option value="1y">Last year</option>
              </select>
            </div>
          </div>
        </header>

        <main className="p-8 space-y-8">
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi, index) => {
              const Icon = kpi.icon
              return (
                <div key={index} className="bg-white rounded-xl border border-nexo-lightGray p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${kpi.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center space-x-1 text-sm font-medium ${
                      kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                      <span>{kpi.change}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-nexo-navy mb-1">{kpi.value}</p>
                    <p className="text-nexo-mediumGray text-sm">{kpi.title}</p>
                    <p className="text-nexo-mediumGray text-xs mt-1">{kpi.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Member Growth Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-nexo-lightGray p-6">
              <h3 className="text-xl font-semibold text-nexo-navy mb-6">Member Growth</h3>
              <div className="h-64 flex items-end justify-between space-x-2">
                {memberGrowthData.map((data, index) => {
                  const height = (data.members / Math.max(...memberGrowthData.map(d => d.members))) * 100
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="text-xs text-nexo-mediumGray mb-2">{data.members}</div>
                      <div 
                        className="w-full bg-nexo-orange rounded-t-lg transition-all hover:bg-primary-600"
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="text-xs text-nexo-mediumGray mt-2">{data.month}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Channel Activity */}
            <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
              <h3 className="text-xl font-semibold text-nexo-navy mb-6">Channel Activity</h3>
              <div className="space-y-4">
                {channelActivity.map((channel, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-nexo-navy">{channel.name}</span>
                      <span className="text-sm text-nexo-mediumGray">{channel.posts} posts</span>
                    </div>
                    <div className="w-full bg-nexo-lightGray rounded-full h-2">
                      <div 
                        className="bg-nexo-orange h-2 rounded-full"
                        style={{ width: `${channel.engagement}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-nexo-mediumGray">{channel.engagement}% engagement</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Event Participation */}
          <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
            <h3 className="text-xl font-semibold text-nexo-navy mb-6">Event Participation</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-nexo-lightGray">
                    <th className="text-left py-3 text-nexo-navy font-semibold">Event</th>
                    <th className="text-center py-3 text-nexo-navy font-semibold">RSVP</th>
                    <th className="text-center py-3 text-nexo-navy font-semibold">Attended</th>
                    <th className="text-center py-3 text-nexo-navy font-semibold">Rate</th>
                    <th className="text-right py-3 text-nexo-navy font-semibold">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {eventParticipation.map((event, index) => (
                    <tr key={index} className="border-b border-nexo-lightGray/50">
                      <td className="py-4 text-nexo-navy font-medium">{event.name}</td>
                      <td className="py-4 text-center text-nexo-mediumGray">{event.rsvp}</td>
                      <td className="py-4 text-center text-nexo-mediumGray">{event.attended}</td>
                      <td className="py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.rate >= 85 ? 'bg-green-100 text-green-700' :
                          event.rate >= 75 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {event.rate}%
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        {event.rate >= 85 ? 
                          <TrendingUp className="w-4 h-4 text-green-600 ml-auto" /> :
                          <TrendingDown className="w-4 h-4 text-red-600 ml-auto" />
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Top Posts */}
            <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
              <h3 className="text-xl font-semibold text-nexo-navy mb-6">Top Performing Posts</h3>
              <div className="space-y-4">
                {topPosts.map((post, index) => (
                  <div key={index} className="p-4 border border-nexo-lightGray rounded-lg">
                    <h4 className="font-medium text-nexo-navy mb-2">{post.title}</h4>
                    <p className="text-sm text-nexo-mediumGray mb-3">by {post.author}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4 text-nexo-mediumGray">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.reactions}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{post.views}</span>
                        </div>
                      </div>
                      <div className="text-nexo-orange font-medium">{post.engagement}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Members */}
            <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
              <h3 className="text-xl font-semibold text-nexo-navy mb-6">Most Active Members</h3>
              <div className="space-y-4">
                {activeMembers.map((member, index) => (
                  <div key={index} className="flex items-center justify-between p-3 hover:bg-nexo-lightGray rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-nexo-orange rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-nexo-navy">{member.name}</h4>
                        <p className="text-sm text-nexo-mediumGray">{member.posts} posts, {member.reactions} reactions</p>
                      </div>
                    </div>
                    <div className="text-nexo-orange font-bold">{member.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Heatmap */}
          <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
            <h3 className="text-xl font-semibold text-nexo-navy mb-6">Activity Heatmap</h3>
            <div className="space-y-2">
              {activityHeatmap.map((day, dayIndex) => (
                <div key={dayIndex} className="flex items-center space-x-2">
                  <div className="w-12 text-xs text-nexo-mediumGray">{day.day}</div>
                  <div className="flex space-x-1">
                    {day.hours.map((hour, hourIndex) => (
                      <div
                        key={hourIndex}
                        className={`w-3 h-3 rounded-sm ${getHeatmapColor(hour)}`}
                        title={`${dayIndex === 0 ? 'Monday' : dayIndex === 1 ? 'Tuesday' : dayIndex === 2 ? 'Wednesday' : dayIndex === 3 ? 'Thursday' : dayIndex === 4 ? 'Friday' : dayIndex === 5 ? 'Saturday' : 'Sunday'} ${hourIndex}:00 - ${hour} activities`}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between text-xs text-nexo-mediumGray mt-4">
                <span>12 AM</span>
                <span>6 AM</span>
                <span>12 PM</span>
                <span>6 PM</span>
                <span>11 PM</span>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
            <h3 className="text-xl font-semibold text-nexo-navy mb-6">Actionable Insights</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {insights.map((insight, index) => {
                const Icon = insight.icon
                return (
                  <div key={index} className={`p-4 border rounded-lg ${getPriorityColor(insight.priority)}`}>
                    <div className="flex items-start space-x-3">
                      <Icon className="w-5 h-5 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{insight.title}</h4>
                        <p className="text-sm mb-2 opacity-90">{insight.description}</p>
                        <p className="text-sm font-medium">{insight.action}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(insight.priority)}`}>
                        {insight.priority}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}