'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { 
  Calendar, Clock, MapPin, Users, Plus, Search, Filter,
  Eye, Edit, Trash2, Copy, Share2, MoreHorizontal,
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react'

export default function EventsPage() {
  const [currentPage, setCurrentPage] = useState('events')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')

  const events = [
    {
      id: 1,
      title: 'React Workshop: Advanced Hooks',
      description: 'Deep dive into React hooks, custom hooks, and performance optimization techniques.',
      date: '2024-01-15',
      time: '14:00',
      duration: '3 hours',
      location: 'Online - Zoom',
      maxAttendees: 50,
      currentAttendees: 32,
      status: 'published',
      image: '/api/placeholder/400/200',
      tags: ['React', 'Workshop', 'Advanced'],
      price: 'Free',
      organizer: 'Sarah Chen'
    },
    {
      id: 2,
      title: 'Community Meetup - January',
      description: 'Monthly networking event for tech professionals. Come meet fellow developers!',
      date: '2024-01-20',
      time: '18:30',
      duration: '2 hours',
      location: 'Tech Hub - São Paulo',
      maxAttendees: 100,
      currentAttendees: 78,
      status: 'published',
      image: '/api/placeholder/400/200',
      tags: ['Networking', 'Meetup'],
      price: 'Free',
      organizer: 'Mike Rodriguez'
    },
    {
      id: 3,
      title: 'Next.js 14 Launch Party',
      description: 'Celebrate the launch of Next.js 14 with demos, talks, and networking.',
      date: '2024-01-25',
      time: '19:00',
      duration: '4 hours',
      location: 'Innovation Center - Rio',
      maxAttendees: 200,
      currentAttendees: 156,
      status: 'published',
      image: '/api/placeholder/400/200',
      tags: ['Next.js', 'Launch', 'Party'],
      price: 'R$ 25',
      organizer: 'Alex Kim'
    },
    {
      id: 4,
      title: 'Design System Workshop',
      description: 'Learn how to build and maintain scalable design systems.',
      date: '2024-02-01',
      time: '10:00',
      duration: '6 hours',
      location: 'Online - Teams',
      maxAttendees: 30,
      currentAttendees: 12,
      status: 'draft',
      image: '/api/placeholder/400/200',
      tags: ['Design', 'Workshop', 'UI/UX'],
      price: 'R$ 150',
      organizer: 'Sarah Chen'
    }
  ]

  const filters = [
    { id: 'all', label: 'All Events', count: events.length },
    { id: 'published', label: 'Published', count: events.filter(e => e.status === 'published').length },
    { id: 'draft', label: 'Drafts', count: events.filter(e => e.status === 'draft').length },
    { id: 'upcoming', label: 'Upcoming', count: events.filter(e => new Date(e.date) > new Date()).length }
  ]

  const filteredEvents = selectedFilter === 'all' 
    ? events 
    : events.filter(event => {
        if (selectedFilter === 'upcoming') return new Date(event.date) > new Date()
        return event.status === selectedFilter
      })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-50'
      case 'draft': return 'text-yellow-600 bg-yellow-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
      default: return 'text-nexo-mediumGray bg-nexo-lightGray'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return CheckCircle
      case 'draft': return AlertCircle
      case 'cancelled': return XCircle
      default: return AlertCircle
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
              <h1 className="text-2xl font-bold text-nexo-navy">Events</h1>
              <p className="text-nexo-mediumGray mt-1">Manage and create community events</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-nexo-mediumGray" />
                <input 
                  type="text" 
                  placeholder="Search events..."
                  className="pl-10 pr-4 py-2 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                />
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Event</span>
              </button>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white border-b border-nexo-lightGray px-8 py-4">
          <div className="flex items-center space-x-6">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-nexo-orange text-white'
                    : 'text-nexo-mediumGray hover:bg-nexo-lightGray hover:text-nexo-navy'
                }`}
              >
                <span className="font-medium">{filter.label}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedFilter === filter.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-nexo-lightGray text-nexo-mediumGray'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <main className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const StatusIcon = getStatusIcon(event.status)
              const attendancePercentage = (event.currentAttendees / event.maxAttendees) * 100
              
              return (
                <div key={event.id} className="bg-white rounded-xl border border-nexo-lightGray overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Event Image */}
                  <div className="h-48 bg-nexo-lightGray flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-nexo-mediumGray" />
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    {/* Status & Actions */}
                    <div className="flex items-center justify-between mb-3">
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span className="capitalize">{event.status}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button className="p-1 hover:bg-nexo-lightGray rounded">
                          <Eye className="w-4 h-4 text-nexo-mediumGray" />
                        </button>
                        <button className="p-1 hover:bg-nexo-lightGray rounded">
                          <Edit className="w-4 h-4 text-nexo-mediumGray" />
                        </button>
                        <button className="p-1 hover:bg-nexo-lightGray rounded">
                          <MoreHorizontal className="w-4 h-4 text-nexo-mediumGray" />
                        </button>
                      </div>
                    </div>

                    {/* Event Title */}
                    <h3 className="text-lg font-semibold text-nexo-navy mb-2 line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Event Description */}
                    <p className="text-nexo-mediumGray text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-nexo-mediumGray">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-nexo-mediumGray">
                        <Clock className="w-4 h-4" />
                        <span>{event.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-nexo-mediumGray">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    {/* Attendance */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-nexo-mediumGray">Attendance</span>
                        <span className="font-medium text-nexo-navy">
                          {event.currentAttendees}/{event.maxAttendees}
                        </span>
                      </div>
                      <div className="w-full bg-nexo-lightGray rounded-full h-2">
                        <div 
                          className="bg-nexo-orange h-2 rounded-full transition-all"
                          style={{ width: `${attendancePercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {event.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-nexo-lightGray text-nexo-mediumGray text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Price & Actions */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-nexo-navy">{event.price}</span>
                        <p className="text-xs text-nexo-mediumGray">by {event.organizer}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-nexo-lightGray rounded-lg">
                          <Share2 className="w-4 h-4 text-nexo-mediumGray" />
                        </button>
                        <button className="p-2 hover:bg-nexo-lightGray rounded-lg">
                          <Copy className="w-4 h-4 text-nexo-mediumGray" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-nexo-mediumGray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-nexo-navy mb-2">No events found</h3>
              <p className="text-nexo-mediumGray mb-6">Create your first event to get started</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                Create Event
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-nexo-lightGray">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-nexo-navy">Create New Event</h2>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-nexo-mediumGray hover:text-nexo-navy"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-nexo-navy mb-2">Event Title</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-nexo-navy mb-2">Description</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none resize-none"
                  placeholder="Describe your event"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-nexo-navy mb-2">Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-nexo-navy mb-2">Time</label>
                  <input 
                    type="time" 
                    className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-nexo-navy mb-2">Location</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                  placeholder="Event location or 'Online'"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-nexo-navy mb-2">Max Attendees</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-nexo-navy mb-2">Price</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                    placeholder="Free or R$ 25"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}