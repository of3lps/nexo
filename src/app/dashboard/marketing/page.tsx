'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { 
  Mail, Users, Share2, Target, Zap, Plus,
  Copy, QrCode, Megaphone,
  TrendingUp, Eye, UserPlus, MousePointer,
  Play, Pause, Edit, MoreHorizontal
} from 'lucide-react'

export default function MarketingPage() {
  const [currentPage, setCurrentPage] = useState('marketing')
  const [activeTab, setActiveTab] = useState('campaigns')

  const campaigns = [
    {
      id: 1,
      name: 'Welcome Series',
      type: 'email',
      status: 'active',
      sent: 1247,
      opened: 892,
      clicked: 234,
      converted: 45,
      created: '2024-01-10'
    },
    {
      id: 2,
      name: 'Event Promotion - React Workshop',
      type: 'social',
      status: 'active',
      sent: 2340,
      opened: 1876,
      clicked: 456,
      converted: 89,
      created: '2024-01-12'
    },
    {
      id: 3,
      name: 'Member Referral Program',
      type: 'referral',
      status: 'paused',
      sent: 567,
      opened: 423,
      clicked: 123,
      converted: 34,
      created: '2024-01-08'
    }
  ]

  const inviteLinks = [
    {
      id: 1,
      name: 'General Invite',
      code: 'TECH2024',
      url: 'nexo.com/join/TECH2024',
      uses: 45,
      maxUses: 100,
      expires: '2024-02-15'
    },
    {
      id: 2,
      name: 'Workshop Attendees',
      code: 'WORKSHOP',
      url: 'nexo.com/join/WORKSHOP',
      uses: 23,
      maxUses: 50,
      expires: '2024-01-30'
    },
    {
      id: 3,
      name: 'VIP Members',
      code: 'VIP2024',
      url: 'nexo.com/join/VIP2024',
      uses: 12,
      maxUses: 25,
      expires: '2024-03-01'
    }
  ]

  const automations = [
    {
      id: 1,
      name: 'New Member Onboarding',
      trigger: 'Member joins',
      actions: ['Send welcome email', 'Add to general channel', 'Schedule intro call'],
      status: 'active',
      triggered: 156,
      completed: 142
    },
    {
      id: 2,
      name: 'Event Reminder Sequence',
      trigger: 'Event RSVP',
      actions: ['Send confirmation', '24h reminder', '1h reminder'],
      status: 'active',
      triggered: 89,
      completed: 78
    },
    {
      id: 3,
      name: 'Inactive Member Re-engagement',
      trigger: '7 days inactive',
      actions: ['Send re-engagement email', 'Suggest popular content'],
      status: 'draft',
      triggered: 23,
      completed: 12
    }
  ]

  const socialPosts = [
    {
      id: 1,
      platform: 'LinkedIn',
      content: 'Join our thriving tech community! 🚀 Connect with 1,200+ developers...',
      scheduled: '2024-01-16 10:00',
      status: 'scheduled',
      engagement: { likes: 0, comments: 0, shares: 0 }
    },
    {
      id: 2,
      platform: 'Twitter',
      content: 'React Workshop this Friday! Limited spots available. Register now 👇',
      scheduled: '2024-01-15 14:30',
      status: 'published',
      engagement: { likes: 45, comments: 12, shares: 8 }
    },
    {
      id: 3,
      platform: 'Instagram',
      content: 'Behind the scenes of our community meetup 📸 #TechCommunity',
      scheduled: '2024-01-14 18:00',
      status: 'published',
      engagement: { likes: 123, comments: 23, shares: 15 }
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'paused': return 'text-yellow-600 bg-yellow-50'
      case 'draft': return 'text-gray-600 bg-gray-50'
      case 'scheduled': return 'text-blue-600 bg-blue-50'
      case 'published': return 'text-green-600 bg-green-50'
      default: return 'text-nexo-mediumGray bg-nexo-lightGray'
    }
  }

  const tabs = [
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'invites', label: 'Invite Links', icon: UserPlus },
    { id: 'automation', label: 'Automation', icon: Zap },
    { id: 'social', label: 'Social Media', icon: Share2 }
  ]

  return (
    <div className="flex h-screen bg-nexo-lightGray">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-nexo-lightGray px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-nexo-navy">Marketing Tools</h1>
              <p className="text-nexo-mediumGray mt-1">Grow your community with powerful marketing features</p>
            </div>
            
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b border-nexo-lightGray px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-nexo-orange text-nexo-orange'
                      : 'border-transparent text-nexo-mediumGray hover:text-nexo-navy'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <main className="p-8">
          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              {/* Campaign Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <Mail className="w-5 h-5 text-nexo-orange" />
                    <span className="font-semibold text-nexo-navy">Total Sent</span>
                  </div>
                  <p className="text-2xl font-bold text-nexo-navy">4,154</p>
                  <p className="text-sm text-nexo-mediumGray">+12% vs last month</p>
                </div>
                <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <Eye className="w-5 h-5 text-nexo-orange" />
                    <span className="font-semibold text-nexo-navy">Open Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-nexo-navy">68.4%</p>
                  <p className="text-sm text-nexo-mediumGray">Above average</p>
                </div>
                <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <MousePointer className="w-5 h-5 text-nexo-orange" />
                    <span className="font-semibold text-nexo-navy">Click Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-nexo-navy">24.7%</p>
                  <p className="text-sm text-nexo-mediumGray">+3% vs last month</p>
                </div>
                <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <Target className="w-5 h-5 text-nexo-orange" />
                    <span className="font-semibold text-nexo-navy">Conversions</span>
                  </div>
                  <p className="text-2xl font-bold text-nexo-navy">168</p>
                  <p className="text-sm text-nexo-mediumGray">4.0% conversion rate</p>
                </div>
              </div>

              {/* Campaigns List */}
              <div className="bg-white rounded-xl border border-nexo-lightGray overflow-hidden">
                <div className="p-6 border-b border-nexo-lightGray">
                  <h3 className="text-xl font-semibold text-nexo-navy">Active Campaigns</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-nexo-lightGray">
                      <tr>
                        <th className="text-left py-3 px-6 text-nexo-navy font-semibold">Campaign</th>
                        <th className="text-center py-3 px-6 text-nexo-navy font-semibold">Type</th>
                        <th className="text-center py-3 px-6 text-nexo-navy font-semibold">Status</th>
                        <th className="text-center py-3 px-6 text-nexo-navy font-semibold">Sent</th>
                        <th className="text-center py-3 px-6 text-nexo-navy font-semibold">Open Rate</th>
                        <th className="text-center py-3 px-6 text-nexo-navy font-semibold">Conversions</th>
                        <th className="text-right py-3 px-6 text-nexo-navy font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((campaign) => (
                        <tr key={campaign.id} className="border-b border-nexo-lightGray/50">
                          <td className="py-4 px-6">
                            <div>
                              <h4 className="font-medium text-nexo-navy">{campaign.name}</h4>
                              <p className="text-sm text-nexo-mediumGray">Created {campaign.created}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="capitalize text-nexo-mediumGray">{campaign.type}</span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                              {campaign.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center text-nexo-navy font-medium">{campaign.sent}</td>
                          <td className="py-4 px-6 text-center text-nexo-navy">
                            {((campaign.opened / campaign.sent) * 100).toFixed(1)}%
                          </td>
                          <td className="py-4 px-6 text-center text-nexo-navy font-medium">{campaign.converted}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-end space-x-2">
                              <button className="p-1 hover:bg-nexo-lightGray rounded">
                                <Eye className="w-4 h-4 text-nexo-mediumGray" />
                              </button>
                              <button className="p-1 hover:bg-nexo-lightGray rounded">
                                <Edit className="w-4 h-4 text-nexo-mediumGray" />
                              </button>
                              <button className="p-1 hover:bg-nexo-lightGray rounded">
                                {campaign.status === 'active' ? 
                                  <Pause className="w-4 h-4 text-nexo-mediumGray" /> :
                                  <Play className="w-4 h-4 text-nexo-mediumGray" />
                                }
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Invite Links Tab */}
          {activeTab === 'invites' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {inviteLinks.map((link) => (
                  <div key={link.id} className="bg-white rounded-xl border border-nexo-lightGray p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-nexo-navy">{link.name}</h3>
                      <button className="p-1 hover:bg-nexo-lightGray rounded">
                        <MoreHorizontal className="w-4 h-4 text-nexo-mediumGray" />
                      </button>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-nexo-mediumGray">Code:</span>
                        <span className="font-mono bg-nexo-lightGray px-2 py-1 rounded">{link.code}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-nexo-mediumGray">Uses:</span>
                        <span className="text-nexo-navy">{link.uses}/{link.maxUses}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-nexo-mediumGray">Expires:</span>
                        <span className="text-nexo-navy">{link.expires}</span>
                      </div>
                    </div>

                    <div className="w-full bg-nexo-lightGray rounded-full h-2 mb-4">
                      <div 
                        className="bg-nexo-orange h-2 rounded-full"
                        style={{ width: `${(link.uses / link.maxUses) * 100}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-2">
                        <Copy className="w-4 h-4" />
                        <span>Copy Link</span>
                      </button>
                      <button className="p-2 border border-nexo-lightGray rounded-lg hover:bg-nexo-lightGray">
                        <QrCode className="w-4 h-4 text-nexo-mediumGray" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
                <h3 className="text-xl font-semibold text-nexo-navy mb-4">Create New Invite Link</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input 
                    type="text" 
                    placeholder="Link name"
                    className="px-4 py-2 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                  />
                  <input 
                    type="number" 
                    placeholder="Max uses"
                    className="px-4 py-2 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                  />
                  <button className="btn-primary">Create Link</button>
                </div>
              </div>
            </div>
          )}

          {/* Automation Tab */}
          {activeTab === 'automation' && (
            <div className="space-y-6">
              <div className="grid gap-6">
                {automations.map((automation) => (
                  <div key={automation.id} className="bg-white rounded-xl border border-nexo-lightGray p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Zap className="w-5 h-5 text-nexo-orange" />
                        <h3 className="font-semibold text-nexo-navy">{automation.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(automation.status)}`}>
                          {automation.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 hover:bg-nexo-lightGray rounded">
                          <Edit className="w-4 h-4 text-nexo-mediumGray" />
                        </button>
                        <button className="p-1 hover:bg-nexo-lightGray rounded">
                          {automation.status === 'active' ? 
                            <Pause className="w-4 h-4 text-nexo-mediumGray" /> :
                            <Play className="w-4 h-4 text-nexo-mediumGray" />
                          }
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-nexo-lightGray p-4 rounded-lg">
                        <h4 className="font-medium text-nexo-navy mb-2">Trigger</h4>
                        <p className="text-sm text-nexo-mediumGray">{automation.trigger}</p>
                      </div>
                      <div className="bg-nexo-lightGray p-4 rounded-lg">
                        <h4 className="font-medium text-nexo-navy mb-2">Actions</h4>
                        <ul className="text-sm text-nexo-mediumGray space-y-1">
                          {automation.actions.map((action, index) => (
                            <li key={index}>• {action}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-nexo-lightGray p-4 rounded-lg">
                        <h4 className="font-medium text-nexo-navy mb-2">Performance</h4>
                        <p className="text-sm text-nexo-mediumGray">
                          {automation.completed}/{automation.triggered} completed
                        </p>
                        <p className="text-sm text-nexo-orange font-medium">
                          {((automation.completed / automation.triggered) * 100).toFixed(1)}% success rate
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="grid gap-4">
                {socialPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl border border-nexo-lightGray p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-nexo-orange rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                          {post.platform[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-nexo-navy">{post.platform}</h3>
                          <p className="text-sm text-nexo-mediumGray">{post.scheduled}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                          {post.status}
                        </span>
                      </div>
                      <button className="p-1 hover:bg-nexo-lightGray rounded">
                        <MoreHorizontal className="w-4 h-4 text-nexo-mediumGray" />
                      </button>
                    </div>

                    <p className="text-nexo-navy mb-4">{post.content}</p>

                    {post.status === 'published' && (
                      <div className="flex items-center space-x-6 text-sm text-nexo-mediumGray">
                        <div className="flex items-center space-x-1">
                          <span>👍</span>
                          <span>{post.engagement.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>💬</span>
                          <span>{post.engagement.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>🔄</span>
                          <span>{post.engagement.shares}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
                <h3 className="text-xl font-semibold text-nexo-navy mb-4">Schedule New Post</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <select className="px-4 py-2 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none">
                      <option>Select Platform</option>
                      <option>LinkedIn</option>
                      <option>Twitter</option>
                      <option>Instagram</option>
                    </select>
                    <input 
                      type="datetime-local"
                      className="px-4 py-2 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                    />
                  </div>
                  <textarea 
                    rows={3}
                    placeholder="Write your post content..."
                    className="w-full px-4 py-2 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none resize-none"
                  />
                  <div className="flex items-center justify-end space-x-4">
                    <button className="btn-secondary">Save Draft</button>
                    <button className="btn-primary">Schedule Post</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}