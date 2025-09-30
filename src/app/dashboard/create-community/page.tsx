'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Sparkles } from 'lucide-react'

export default function CreateCommunity() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/dashboard')
      } else {
        setError(data.error || 'Failed to create community')
      }
    } catch (error) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-nexo-lightGray">
      <div className="max-w-2xl mx-auto pt-12 px-6">
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-nexo-mediumGray hover:text-nexo-navy mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-nexo-orange to-nexo-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-nexo-navy mb-2">Create Your Community</h1>
            <p className="text-nexo-mediumGray">Set up your community in just a few steps</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-nexo-lightGray p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-nexo-navy mb-2">
                Community Name *
              </label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none transition-all"
                placeholder="e.g. Tech Innovators"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-nexo-navy mb-2">
                Description
              </label>
              <textarea 
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none transition-all resize-none"
                placeholder="Describe what your community is about..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-nexo-navy mb-2">
                Community URL
              </label>
              <div className="flex items-center">
                <span className="text-nexo-mediumGray text-sm mr-2">nexo.com/</span>
                <input 
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="flex-1 px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none transition-all"
                  placeholder="tech-innovators"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6">
              <button 
                type="button"
                onClick={() => router.back()}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Community'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}