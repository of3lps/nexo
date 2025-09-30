'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { ArrowRight, Users, Calendar, BarChart3, Sparkles, Globe, Zap } from 'lucide-react'

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState<boolean | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        // Login
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false
        })

        if (result?.error) {
          setError('Invalid credentials')
        } else {
          window.location.href = '/dashboard'
        }
      } else {
        // Register
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })

        const data = await response.json()

        if (response.ok) {
          // Auto login after register
          const result = await signIn('credentials', {
            email: formData.email,
            password: formData.password,
            redirect: false
          })

          if (!result?.error) {
            window.location.href = '/dashboard'
          }
        } else {
          setError(data.error || 'Registration failed')
        }
      }
    } catch (error) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-nexo-lightGray via-white to-white">
          <div className="absolute inset-0 opacity-40">
            <div className="w-full h-full" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e0f2fe' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-nexo-orange to-nexo-navy rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Nexo</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-slate-600 hover:text-slate-900 font-medium">
              Features
            </button>
            <button className="text-slate-600 hover:text-slate-900 font-medium">
              Pricing
            </button>
            <button 
              onClick={() => setIsLogin(true)}
              className="btn-secondary"
            >
              Sign In
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 mb-8">
              <Zap className="w-4 h-4 text-nexo-orange" />
              <span className="text-sm font-medium text-slate-700">Launch your community in minutes</span>
            </div>
            
            <h1 className="text-6xl font-bold text-nexo-navy mb-6 leading-tight">
              Build Amazing
              <span className="gradient-text block">Communities</span>
              That Actually Engage
            </h1>
            
            <p className="text-xl text-nexo-mediumGray mb-12 max-w-2xl mx-auto leading-relaxed">
              Create your white-label community platform with powerful analytics, 
              seamless events, and built-in monetization tools.
            </p>
            
            <div className="flex items-center justify-center space-x-4">
              <button 
                onClick={() => setIsLogin(false)}
                className="btn-primary text-lg px-8 py-4"
              >
                Start Building <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 -mt-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl animate-slide-up">
              <div className="w-12 h-12 bg-gradient-to-br from-nexo-orange to-primary-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-nexo-navy mb-3">Smart Member Management</h3>
              <p className="text-nexo-mediumGray">Advanced tools to grow, engage, and retain your community members with automated workflows.</p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-12 h-12 bg-gradient-to-br from-nexo-orange to-nexo-navy rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-nexo-navy mb-3">Seamless Events</h3>
              <p className="text-nexo-mediumGray">Create, manage, and track events with built-in RSVP, reminders, and attendance analytics.</p>
            </div>
            
            <div className="glass-card p-8 rounded-2xl animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 bg-gradient-to-br from-nexo-navy to-nexo-orange rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-nexo-navy mb-3">Powerful Analytics</h3>
              <p className="text-nexo-mediumGray">Deep insights into engagement, growth, and revenue with actionable recommendations.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {(isLogin !== null) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-8 rounded-2xl w-full max-w-md animate-slide-up">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-nexo-orange to-nexo-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-nexo-navy mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-nexo-mediumGray">
                {isLogin ? 'Sign in to your Nexo dashboard' : 'Start building your community today'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-nexo-navy mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg border border-nexo-lightGray focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none transition-all"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-nexo-navy mb-2">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-nexo-lightGray focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-nexo-navy mb-2">Password</label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-nexo-lightGray focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none transition-all"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            <button 
              onClick={() => setIsLogin(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}