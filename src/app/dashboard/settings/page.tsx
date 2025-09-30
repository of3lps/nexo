'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { 
  Settings, Palette, Users, Shield, Bell, CreditCard,
  Upload, Save, Eye, EyeOff, Globe, Lock, Mail,
  Smartphone, Monitor, Moon, Sun, Volume2, VolumeX
} from 'lucide-react'

export default function SettingsPage() {
  const [currentPage, setCurrentPage] = useState('settings')
  const [activeTab, setActiveTab] = useState('general')
  const [communityName, setCommunityName] = useState('Tech Community')
  const [communityDescription, setCommunityDescription] = useState('A thriving community for tech professionals')
  const [primaryColor, setPrimaryColor] = useState('#FF6B35')
  const [secondaryColor, setSecondaryColor] = useState('#1E2A38')

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ]

  const memberRoles = [
    { id: 1, name: 'Admin', permissions: ['All permissions'], members: 2, color: 'red' },
    { id: 2, name: 'Moderator', permissions: ['Manage posts', 'Manage members'], members: 5, color: 'blue' },
    { id: 3, name: 'Member', permissions: ['Create posts', 'Comment'], members: 1240, color: 'green' }
  ]

  const notificationSettings = [
    { id: 'new_members', label: 'New member joins', email: true, push: true, sms: false },
    { id: 'new_posts', label: 'New posts in community', email: false, push: true, sms: false },
    { id: 'events', label: 'Event reminders', email: true, push: true, sms: true },
    { id: 'mentions', label: 'When mentioned', email: true, push: true, sms: false },
    { id: 'weekly_digest', label: 'Weekly digest', email: true, push: false, sms: false }
  ]

  return (
    <div className="flex h-screen bg-nexo-lightGray">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-nexo-lightGray px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-nexo-navy">Settings</h1>
              <p className="text-nexo-mediumGray mt-1">Manage your community settings and preferences</p>
            </div>
            
            <button className="btn-primary flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b border-nexo-lightGray px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors whitespace-nowrap ${
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
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="max-w-2xl space-y-8">
              <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
                <h3 className="text-xl font-semibold text-nexo-navy mb-6">Community Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-nexo-navy mb-2">Community Name</label>
                    <input 
                      type="text" 
                      value={communityName}
                      onChange={(e) => setCommunityName(e.target.value)}
                      className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-nexo-navy mb-2">Description</label>
                    <textarea 
                      rows={3}
                      value={communityDescription}
                      onChange={(e) => setCommunityDescription(e.target.value)}
                      className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-nexo-navy mb-2">Community Logo</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-nexo-lightGray rounded-xl flex items-center justify-center">
                        <Upload className="w-6 h-6 text-nexo-mediumGray" />
                      </div>
                      <div>
                        <button className="btn-secondary text-sm">Upload Logo</button>
                        <p className="text-xs text-nexo-mediumGray mt-1">PNG, JPG up to 2MB</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-nexo-navy mb-2">Custom Domain</label>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="text" 
                        placeholder="your-community"
                        className="flex-1 px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                      />
                      <span className="text-nexo-mediumGray">.nexo.com</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
                <h3 className="text-xl font-semibold text-nexo-navy mb-6">Community Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-nexo-navy">Public Community</h4>
                      <p className="text-sm text-nexo-mediumGray">Anyone can find and join your community</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-nexo-orange">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-nexo-navy">Require Approval</h4>
                      <p className="text-sm text-nexo-mediumGray">New members need approval to join</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-nexo-navy">Allow Invites</h4>
                      <p className="text-sm text-nexo-mediumGray">Members can invite others to join</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-nexo-orange">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="max-w-2xl space-y-8">
              <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
                <h3 className="text-xl font-semibold text-nexo-navy mb-6">Brand Colors</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-nexo-navy mb-2">Primary Color</label>
                    <div className="flex items-center space-x-3">
                      <input 
                        type="color" 
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-12 h-12 rounded-lg border border-nexo-lightGray cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-nexo-navy mb-2">Secondary Color</label>
                    <div className="flex items-center space-x-3">
                      <input 
                        type="color" 
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-12 h-12 rounded-lg border border-nexo-lightGray cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="flex-1 px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-nexo-lightGray rounded-lg">
                  <h4 className="font-medium text-nexo-navy mb-3">Preview</h4>
                  <div className="flex items-center space-x-4">
                    <button 
                      className="px-4 py-2 rounded-lg text-white font-medium"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Primary Button
                    </button>
                    <button 
                      className="px-4 py-2 rounded-lg border-2 font-medium"
                      style={{ 
                        borderColor: secondaryColor, 
                        color: secondaryColor 
                      }}
                    >
                      Secondary Button
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
                <h3 className="text-xl font-semibold text-nexo-navy mb-6">Theme Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-nexo-navy mb-3">Theme Mode</label>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-2 px-4 py-3 border-2 border-nexo-orange bg-nexo-orange/10 text-nexo-orange rounded-lg">
                        <Sun className="w-4 h-4" />
                        <span>Light</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-3 border border-nexo-lightGray text-nexo-mediumGray rounded-lg hover:border-nexo-orange">
                        <Moon className="w-4 h-4" />
                        <span>Dark</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-nexo-navy mb-3">Layout</label>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-2 px-4 py-3 border-2 border-nexo-orange bg-nexo-orange/10 text-nexo-orange rounded-lg">
                        <Monitor className="w-4 h-4" />
                        <span>Wide</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-3 border border-nexo-lightGray text-nexo-mediumGray rounded-lg hover:border-nexo-orange">
                        <Smartphone className="w-4 h-4" />
                        <span>Compact</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div className="max-w-4xl space-y-8">
              <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
                <h3 className="text-xl font-semibold text-nexo-navy mb-6">Member Roles</h3>
                
                <div className="space-y-4">
                  {memberRoles.map((role) => (
                    <div key={role.id} className="flex items-center justify-between p-4 border border-nexo-lightGray rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full bg-${role.color}-500`}></div>
                        <div>
                          <h4 className="font-medium text-nexo-navy">{role.name}</h4>
                          <p className="text-sm text-nexo-mediumGray">{role.permissions.join(', ')}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-nexo-mediumGray">{role.members} members</span>
                        <button className="text-nexo-orange hover:text-nexo-navy">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-4 btn-secondary">Add New Role</button>
              </div>

              <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
                <h3 className="text-xl font-semibold text-nexo-navy mb-6">Member Management</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-nexo-navy">Auto-assign Role</h4>
                      <p className="text-sm text-nexo-mediumGray">Automatically assign role to new members</p>
                    </div>
                    <select className="px-4 py-2 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none">
                      <option>Member</option>
                      <option>Moderator</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-nexo-navy">Member Limit</h4>
                      <p className="text-sm text-nexo-mediumGray">Maximum number of members allowed</p>
                    </div>
                    <input 
                      type="number" 
                      placeholder="Unlimited"
                      className="w-32 px-4 py-2 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="max-w-2xl space-y-8">
              <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
                <h3 className="text-xl font-semibold text-nexo-navy mb-6">Privacy Settings</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-nexo-navy">Private Community</h4>
                      <p className="text-sm text-nexo-mediumGray">Only members can see community content</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-nexo-navy">Hide Member List</h4>
                      <p className="text-sm text-nexo-mediumGray">Don't show member list to non-members</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-nexo-orange">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-nexo-navy">Search Engine Indexing</h4>
                      <p className="text-sm text-nexo-mediumGray">Allow search engines to index your community</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-nexo-orange">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
                <h3 className="text-xl font-semibold text-nexo-navy mb-6">Data & Analytics</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-nexo-navy">Analytics Tracking</h4>
                      <p className="text-sm text-nexo-mediumGray">Collect analytics data for insights</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-nexo-orange">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-nexo-navy">Data Export</h4>
                      <p className="text-sm text-nexo-mediumGray">Allow members to export their data</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-nexo-orange">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="max-w-4xl space-y-8">
              <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
                <h3 className="text-xl font-semibold text-nexo-navy mb-6">Notification Preferences</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-nexo-lightGray">
                        <th className="text-left py-3 text-nexo-navy font-semibold">Event</th>
                        <th className="text-center py-3 text-nexo-navy font-semibold">
                          <Mail className="w-4 h-4 mx-auto" />
                        </th>
                        <th className="text-center py-3 text-nexo-navy font-semibold">
                          <Bell className="w-4 h-4 mx-auto" />
                        </th>
                        <th className="text-center py-3 text-nexo-navy font-semibold">
                          <Smartphone className="w-4 h-4 mx-auto" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {notificationSettings.map((setting) => (
                        <tr key={setting.id} className="border-b border-nexo-lightGray/50">
                          <td className="py-4 text-nexo-navy font-medium">{setting.label}</td>
                          <td className="py-4 text-center">
                            <button className={`relative inline-flex h-5 w-9 items-center rounded-full ${
                              setting.email ? 'bg-nexo-orange' : 'bg-gray-200'
                            }`}>
                              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
                                setting.email ? 'translate-x-5' : 'translate-x-1'
                              }`}></span>
                            </button>
                          </td>
                          <td className="py-4 text-center">
                            <button className={`relative inline-flex h-5 w-9 items-center rounded-full ${
                              setting.push ? 'bg-nexo-orange' : 'bg-gray-200'
                            }`}>
                              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
                                setting.push ? 'translate-x-5' : 'translate-x-1'
                              }`}></span>
                            </button>
                          </td>
                          <td className="py-4 text-center">
                            <button className={`relative inline-flex h-5 w-9 items-center rounded-full ${
                              setting.sms ? 'bg-nexo-orange' : 'bg-gray-200'
                            }`}>
                              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
                                setting.sms ? 'translate-x-5' : 'translate-x-1'
                              }`}></span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="max-w-2xl space-y-8">
              <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
                <h3 className="text-xl font-semibold text-nexo-navy mb-6">Current Plan</h3>
                
                <div className="flex items-center justify-between p-4 bg-nexo-lightGray rounded-lg mb-6">
                  <div>
                    <h4 className="font-semibold text-nexo-navy">Pro Plan</h4>
                    <p className="text-sm text-nexo-mediumGray">Up to 5,000 members</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-nexo-navy">R$ 99</p>
                    <p className="text-sm text-nexo-mediumGray">per month</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-nexo-navy">Next billing date</span>
                    <span className="text-nexo-mediumGray">February 15, 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-nexo-navy">Payment method</span>
                    <span className="text-nexo-mediumGray">•••• •••• •••• 4242</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-6">
                  <button className="btn-primary">Upgrade Plan</button>
                  <button className="btn-secondary">Update Payment</button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-nexo-lightGray p-6">
                <h3 className="text-xl font-semibold text-nexo-navy mb-6">Usage This Month</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-nexo-navy">Members</span>
                      <span className="text-nexo-mediumGray">1,247 / 5,000</span>
                    </div>
                    <div className="w-full bg-nexo-lightGray rounded-full h-2">
                      <div className="bg-nexo-orange h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-nexo-navy">Events</span>
                      <span className="text-nexo-mediumGray">23 / 100</span>
                    </div>
                    <div className="w-full bg-nexo-lightGray rounded-full h-2">
                      <div className="bg-nexo-orange h-2 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-nexo-navy">Storage</span>
                      <span className="text-nexo-mediumGray">2.4 GB / 10 GB</span>
                    </div>
                    <div className="w-full bg-nexo-lightGray rounded-full h-2">
                      <div className="bg-nexo-orange h-2 rounded-full" style={{ width: '24%' }}></div>
                    </div>
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