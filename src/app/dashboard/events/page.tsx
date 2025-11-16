'use client'

import { useState, useEffect } from 'react'
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
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [communities, setCommunities] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: '',
    price: '',
    communityId: ''
  })
  const [editingEvent, setEditingEvent] = useState(null)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [registrationData, setRegistrationData] = useState({})
  const [showFormEditor, setShowFormEditor] = useState(false)
  const [editingFormEvent, setEditingFormEvent] = useState(null)
  const [formFields, setFormFields] = useState([
    { id: 1, label: 'Full Name', type: 'text', required: true },
    { id: 2, label: 'Email', type: 'email', required: true },
    { id: 3, label: 'Phone', type: 'tel', required: false },
    { id: 4, label: 'Additional Notes', type: 'textarea', required: false }
  ])

  useEffect(() => {
    fetchEvents()
    fetchCommunities()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        console.log('Events data:', data)
        setEvents(data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCommunities = async () => {
    try {
      const response = await fetch('/api/communities')
      if (response.ok) {
        const data = await response.json()
        setCommunities(data)
      }
    } catch (error) {
      console.error('Error fetching communities:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const dateTime = `${formData.date}T${formData.time}:00`
      const url = editingEvent ? `/api/events/${editingEvent.id}` : '/api/events'
      const method = editingEvent ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: dateTime,
          maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null
        })
      })

      if (response.ok) {
        setShowCreateModal(false)
        setEditingEvent(null)
        setFormData({
          title: '',
          description: '',
          date: '',
          time: '',
          location: '',
          maxAttendees: '',
          price: '',
          communityId: ''
        })
        fetchEvents()
      } else {
        const error = await response.json()
        alert(error.error || 'Error saving event')
      }
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Error saving event')
    }
  }

  const handleEdit = (event: any) => {
    const eventDate = new Date(event.date)
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description || '',
      date: eventDate.toISOString().split('T')[0],
      time: eventDate.toTimeString().slice(0, 5),
      location: event.location || '',
      maxAttendees: event.maxAttendees?.toString() || '',
      price: event.price || '',
      communityId: event.communityId
    })
    setShowCreateModal(true)
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchEvents()
      } else {
        alert('Error deleting event')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Error deleting event')
    }
  }

  const handleAttendance = async (eventId: string, isAttending: boolean) => {
    if (isAttending) {
      // Cancelar inscrição
      try {
        const response = await fetch(`/api/events/${eventId}/attend`, {
          method: 'DELETE'
        })

        if (response.ok) {
          fetchEvents()
        } else {
          const error = await response.json()
          alert(error.error || 'Error updating attendance')
        }
      } catch (error) {
        console.error('Error updating attendance:', error)
        alert('Error updating attendance')
      }
    } else {
      // Abrir modal de inscrição
      const event = events.find(e => e.id === eventId)
      setSelectedEvent(event)
      setRegistrationData({})
      setShowRegistrationModal(true)
    }
  }

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`/api/events/${selectedEvent.id}/attend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: registrationData
        })
      })

      if (response.ok) {
        setShowRegistrationModal(false)
        setSelectedEvent(null)
        setRegistrationData({})
        fetchEvents()
      } else {
        const error = await response.json()
        alert(error.error || 'Error registering for event')
      }
    } catch (error) {
      console.error('Error registering for event:', error)
      alert('Error registering for event')
    }
  }

  const handleEditForm = (event: any) => {
    setEditingFormEvent(event)
    let fields = [
      { id: 1, label: 'Full Name', type: 'text', required: true },
      { id: 2, label: 'Email', type: 'email', required: true },
      { id: 3, label: 'Phone', type: 'tel', required: false },
      { id: 4, label: 'Additional Notes', type: 'textarea', required: false }
    ]
    
    if (event.registrationForm) {
      try {
        fields = typeof event.registrationForm === 'string' 
          ? JSON.parse(event.registrationForm) 
          : event.registrationForm
      } catch (e) {
        console.error('Error parsing form:', e)
      }
    }
    
    setFormFields(fields)
    setShowFormEditor(true)
  }

  const handleSaveForm = async () => {
    try {
      const response = await fetch(`/api/events/${editingFormEvent.id}/form`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationForm: formFields
        })
      })

      if (response.ok) {
        setShowFormEditor(false)
        setEditingFormEvent(null)
        fetchEvents()
      } else {
        alert('Error saving form')
      }
    } catch (error) {
      console.error('Error saving form:', error)
      alert('Error saving form')
    }
  }

  const filters = [
    { id: 'all', label: 'All Events', count: events.length },
    { id: 'upcoming', label: 'Upcoming', count: events.filter(e => new Date(e.date) > new Date()).length },
    { id: 'past', label: 'Past', count: events.filter(e => new Date(e.date) <= new Date()).length }
  ]

  const filteredEvents = selectedFilter === 'all' 
    ? events 
    : events.filter(event => {
        if (selectedFilter === 'upcoming') return new Date(event.date) > new Date()
        if (selectedFilter === 'past') return new Date(event.date) <= new Date()
        return true
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
              const attendancePercentage = event.maxAttendees ? (event._count.attendees / event.maxAttendees) * 100 : 0
              
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
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('published')}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span className="capitalize">published</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button className="p-1 hover:bg-nexo-lightGray rounded">
                          <Eye className="w-4 h-4 text-nexo-mediumGray" />
                        </button>
                        <button 
                          onClick={() => handleEdit(event)}
                          className="p-1 hover:bg-nexo-lightGray rounded"
                        >
                          <Edit className="w-4 h-4 text-nexo-mediumGray" />
                        </button>
                        <button 
                          onClick={() => handleEditForm(event)}
                          className="p-1 hover:bg-nexo-lightGray rounded"
                          title="Edit Registration Form"
                        >
                          <Users className="w-4 h-4 text-nexo-mediumGray" />
                        </button>
                        <button 
                          onClick={() => handleDelete(event.id)}
                          className="p-1 hover:bg-red-100 rounded text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
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
                        <span>{new Date(event.date).toLocaleDateString('pt-BR')} às {new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
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
                          {event._count.attendees}/{event.maxAttendees || 'Unlimited'}
                        </span>
                      </div>
                      <div className="w-full bg-nexo-lightGray rounded-full h-2">
                        <div 
                          className="bg-nexo-orange h-2 rounded-full transition-all"
                          style={{ width: `${attendancePercentage}%` }}
                        ></div>
                      </div>
                    </div>



                    {/* Price & Attendance */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-lg font-bold text-nexo-navy">{event.price || 'Free'}</span>
                        <p className="text-xs text-nexo-mediumGray">by {event.creator?.name || 'Organizer'}</p>
                      </div>
                    </div>

                    {/* Attendance Button */}
                    <button
                      onClick={() => handleAttendance(event.id, event.isAttending)}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        event.isAttending
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-nexo-orange text-white hover:bg-nexo-orange/90'
                      }`}
                    >
                      {event.isAttending ? 'Registered ✓' : 'Register for Event'}
                    </button>
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
                <h2 className="text-2xl font-bold text-nexo-navy">
                  {editingEvent ? 'Edit Event' : 'Create New Event'}
                </h2>
                <button 
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingEvent(null)
                    setFormData({
                      title: '',
                      description: '',
                      date: '',
                      time: '',
                      location: '',
                      maxAttendees: '',
                      price: '',
                      communityId: ''
                    })
                  }}
                  className="text-nexo-mediumGray hover:text-nexo-navy"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-nexo-navy mb-2">Event Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-nexo-navy mb-2">Community</label>
                <select 
                  value={formData.communityId}
                  onChange={(e) => setFormData({...formData, communityId: e.target.value})}
                  className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                  required
                >
                  <option value="">Select a community</option>
                  {communities.map((community: any) => (
                    <option key={community.id} value={community.id}>
                      {community.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-nexo-navy mb-2">Description</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none resize-none"
                  placeholder="Describe your event"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-nexo-navy mb-2">Date</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-nexo-navy mb-2">Time</label>
                  <input 
                    type="time" 
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-nexo-navy mb-2">Location</label>
                <input 
                  type="text" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                  placeholder="Event location or 'Online'"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-nexo-navy mb-2">Max Attendees</label>
                  <input 
                    type="number" 
                    value={formData.maxAttendees}
                    onChange={(e) => setFormData({...formData, maxAttendees: e.target.value})}
                    className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-nexo-navy mb-2">Price</label>
                  <input 
                    type="text" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
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
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegistrationModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-nexo-lightGray">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-nexo-navy">Register for Event</h2>
                <button 
                  onClick={() => {
                    setShowRegistrationModal(false)
                    setSelectedEvent(null)
                    setRegistrationData({})
                  }}
                  className="text-nexo-mediumGray hover:text-nexo-navy"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-nexo-mediumGray mt-2">{selectedEvent.title}</p>
            </div>
            
            <form onSubmit={handleRegistrationSubmit} className="p-6 space-y-4">
              {(selectedEvent.registrationForm || [
                { id: 1, label: 'Full Name', type: 'text', required: true },
                { id: 2, label: 'Email', type: 'email', required: true },
                { id: 3, label: 'Phone', type: 'tel', required: false },
                { id: 4, label: 'Additional Notes', type: 'textarea', required: false }
              ]).map((field) => {
                const fieldKey = field.label.toLowerCase().replace(/\s+/g, '_')
                
                return (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-nexo-navy mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea 
                        rows={3}
                        value={registrationData[fieldKey] || ''}
                        onChange={(e) => setRegistrationData({...registrationData, [fieldKey]: e.target.value})}
                        className="w-full px-3 py-2 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none resize-none"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        required={field.required}
                      />
                    ) : (
                      <input 
                        type={field.type}
                        value={registrationData[fieldKey] || ''}
                        onChange={(e) => setRegistrationData({...registrationData, [fieldKey]: e.target.value})}
                        className="w-full px-3 py-2 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                        required={field.required}
                      />
                    )}
                  </div>
                )
              })}

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowRegistrationModal(false)
                    setSelectedEvent(null)
                    setRegistrationData({})
                  }}
                  className="px-4 py-2 text-nexo-mediumGray hover:text-nexo-navy"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Form Editor Modal */}
      {showFormEditor && editingFormEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-nexo-lightGray">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-nexo-navy">Edit Registration Form</h2>
                <button 
                  onClick={() => {
                    setShowFormEditor(false)
                    setEditingFormEvent(null)
                  }}
                  className="text-nexo-mediumGray hover:text-nexo-navy"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-nexo-mediumGray mt-2">{editingFormEvent.title}</p>
            </div>
            
            <div className="p-6 space-y-4">
              {formFields.map((field, index) => (
                <div key={field.id} className="border border-nexo-lightGray rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-nexo-navy mb-1">Label</label>
                      <input 
                        type="text" 
                        value={field.label}
                        onChange={(e) => {
                          const newFields = [...formFields]
                          newFields[index].label = e.target.value
                          setFormFields(newFields)
                        }}
                        className="w-full px-3 py-2 border border-nexo-lightGray rounded focus:border-nexo-orange outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-nexo-navy mb-1">Type</label>
                      <select 
                        value={field.type}
                        onChange={(e) => {
                          const newFields = [...formFields]
                          newFields[index].type = e.target.value
                          setFormFields(newFields)
                        }}
                        className="w-full px-3 py-2 border border-nexo-lightGray rounded focus:border-nexo-orange outline-none text-sm"
                      >
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="tel">Phone</option>
                        <option value="textarea">Textarea</option>
                        <option value="select">Select</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={field.required}
                        onChange={(e) => {
                          const newFields = [...formFields]
                          newFields[index].required = e.target.checked
                          setFormFields(newFields)
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-nexo-navy">Required</span>
                    </label>
                    <button 
                      onClick={() => {
                        const newFields = formFields.filter((_, i) => i !== index)
                        setFormFields(newFields)
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => {
                  const newField = {
                    id: Date.now(),
                    label: 'New Field',
                    type: 'text',
                    required: false
                  }
                  setFormFields([...formFields, newField])
                }}
                className="w-full py-2 border-2 border-dashed border-nexo-lightGray rounded-lg text-nexo-mediumGray hover:border-nexo-orange hover:text-nexo-orange transition-colors"
              >
                + Add Field
              </button>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-nexo-lightGray">
                <button 
                  onClick={() => {
                    setShowFormEditor(false)
                    setEditingFormEvent(null)
                  }}
                  className="px-4 py-2 text-nexo-mediumGray hover:text-nexo-navy"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveForm}
                  className="btn-primary"
                >
                  Save Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}