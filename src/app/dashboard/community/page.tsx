'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Sidebar from '@/components/Sidebar'
import { useOnlineMembers } from '@/hooks/useOnlineMembers'
import { 
  MessageSquare, Heart, Share2, MoreHorizontal, 
  Image, Smile, AtSign, Hash, Pin, Users,
  Search, Filter, Plus, Send, Paperclip, Lock
} from 'lucide-react'

function OnlineMembersSection({ communityId }: { communityId: string | null }) {
  const { onlineMembers, loading } = useOnlineMembers(communityId)

  if (loading) {
    return (
      <div className="p-4 border-t border-nexo-lightGray">
        <h3 className="text-sm font-semibold text-nexo-navy mb-3">Online</h3>
        <div className="text-xs text-nexo-mediumGray">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-4 border-t border-nexo-lightGray">
      <h3 className="text-sm font-semibold text-nexo-navy mb-3">
        Online - {onlineMembers.length}
      </h3>
      <div className="space-y-2">
        {onlineMembers.length === 0 ? (
          <div className="text-xs text-nexo-mediumGray">No members online</div>
        ) : (
          onlineMembers.map((member) => (
            <div key={member.id} className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-nexo-orange flex items-center justify-center text-white text-xs font-semibold">
                  {member.name?.[0] || 'U'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-sm text-nexo-mediumGray truncate">
                {member.name || 'Unknown'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default function CommunityFeed() {
  const [currentPage, setCurrentPage] = useState('community')
  const [newPost, setNewPost] = useState('')
  const [selectedChannel, setSelectedChannel] = useState('')
  const [channels, setChannels] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [communities, setCommunities] = useState<any[]>([])
  const [currentCommunity, setCurrentCommunity] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showChannelModal, setShowChannelModal] = useState(false)
  const [editingChannel, setEditingChannel] = useState<any>(null)
  const [channelForm, setChannelForm] = useState({ name: '', description: '', isPrivate: false, memberIds: [] })
  const [communityMembers, setCommunityMembers] = useState<any[]>([])
  const [memberSearch, setMemberSearch] = useState('')
  const [attachments, setAttachments] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      fetchCommunities()
    }
  }, [session])

  useEffect(() => {
    if (currentCommunity) {
      fetchChannels()
    }
  }, [currentCommunity])

  useEffect(() => {
    if (selectedChannel) {
      fetchPosts()
    }
  }, [selectedChannel])

  const fetchCommunities = async () => {
    try {
      const response = await fetch('/api/communities')
      if (response.ok) {
        const data = await response.json()
        setCommunities(data)
        if (data.length > 0) {
          setCurrentCommunity(data[0])
        } else {
          setLoading(false)
        }
      } else {
        console.error('Failed to fetch communities:', response.status)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching communities:', error)
      setLoading(false)
    }
  }

  const fetchChannels = async () => {
    try {
      const response = await fetch(`/api/channels?communityId=${currentCommunity.id}`)
      if (response.ok) {
        const data = await response.json()
        setChannels(data)
        if (data.length > 0) {
          setSelectedChannel(data[0].id)
        }
      } else {
        console.error('Failed to fetch channels:', response.status)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching channels:', error)
      setLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/posts?channelId=${selectedChannel}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const fileData = await response.json()
        setAttachments(prev => [...prev, fileData])
      } else {
        alert('Failed to upload file')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim() && !attachments.length) return
    if (!selectedChannel) return

    const originalPost = newPost
    const originalAttachments = [...attachments]
    setNewPost('')
    setAttachments([])

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: originalPost,
          channelId: selectedChannel,
          attachments: originalAttachments
        })
      })

      if (response.ok) {
        await fetchPosts()
      } else {
        const error = await response.json()
        console.error('Failed to create post:', error)
        setNewPost(originalPost)
        setAttachments(originalAttachments)
        alert('Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      setNewPost(originalPost)
      setAttachments(originalAttachments)
      alert('Network error. Please check your connection.')
    }
  }

  const handleReaction = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'LIKE' })
      })

      if (response.ok) {
        await fetchPosts()
      } else {
        console.error('Failed to react to post')
      }
    } catch (error) {
      console.error('Error reacting to post:', error)
    }
  }

  const handleCreateChannel = async () => {
    setEditingChannel(null)
    setChannelForm({ name: '', description: '', isPrivate: false, memberIds: [] })
    setMemberSearch('')
    await fetchCommunityMembers()
    setShowChannelModal(true)
  }

  const handleEditChannel = async (channel: any) => {
    setEditingChannel(channel)
    setChannelForm({ 
      name: channel.name, 
      description: channel.description || '',
      isPrivate: channel.isPrivate || false,
      memberIds: [] 
    })
    setMemberSearch('')
    await fetchCommunityMembers()
    setShowChannelModal(true)
  }

  const handleSaveChannel = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!channelForm.name.trim()) return

    try {
      if (editingChannel) {
        const response = await fetch(`/api/channels/${editingChannel.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: channelForm.name,
            description: channelForm.description
          })
        })
        if (response.ok) {
          await fetchChannels()
          setShowChannelModal(false)
        } else {
          console.error('Failed to update channel:', response.status)
        }
      } else {
        const payload = {
          name: channelForm.name,
          description: channelForm.description,
          communityId: currentCommunity.id,
          isPrivate: channelForm.isPrivate,
          memberIds: channelForm.isPrivate ? channelForm.memberIds : []
        }
        console.log('Sending channel data:', payload)
        const response = await fetch('/api/channels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (response.ok) {
          const newChannel = await response.json()
          console.log('Channel created successfully:', newChannel)
          await fetchChannels()
          setShowChannelModal(false)
        } else {
          console.error('Response status:', response.status)
          const errorText = await response.text()
          console.error('Error response:', errorText)
          alert('Failed to create channel. Check console for details.')
        }
      }
    } catch (error) {
      console.error('Error saving channel:', error)
    }
  }

  const handleDeleteChannel = async (channelId: string) => {
    if (!confirm('Are you sure you want to delete this channel?')) return

    try {
      const response = await fetch(`/api/channels/${channelId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchChannels()
        if (selectedChannel === channelId && channels.length > 1) {
          setSelectedChannel(channels.find(c => c.id !== channelId)?.id || '')
        }
      }
    } catch (error) {
      console.error('Error deleting channel:', error)
    }
  }

  const fetchCommunityMembers = async () => {
    try {
      const response = await fetch(`/api/communities/${currentCommunity.id}/members`)
      if (response.ok) {
        const data = await response.json()
        setCommunityMembers(data)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    }
  }

  const toggleMember = (userId: string) => {
    setChannelForm(prev => ({
      ...prev,
      memberIds: prev.memberIds.includes(userId)
        ? prev.memberIds.filter(id => id !== userId)
        : [...prev.memberIds, userId]
    }))
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-nexo-lightGray items-center justify-center">
        <div className="text-nexo-navy">Loading...</div>
      </div>
    )
  }

  if (!currentCommunity) {
    return (
      <div className="flex h-screen bg-nexo-lightGray items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-nexo-navy mb-2">No Community Found</h2>
          <p className="text-nexo-mediumGray">Please create a community first</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-nexo-lightGray">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Channels Sidebar */}
        <div className="w-64 bg-white border-r border-nexo-lightGray flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-nexo-lightGray">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-nexo-navy">Channels</h2>
              <button 
                onClick={handleCreateChannel}
                className="p-1 hover:bg-nexo-lightGray rounded"
              >
                <Plus className="w-4 h-4 text-nexo-mediumGray" />
              </button>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-nexo-mediumGray" />
              <input 
                type="text" 
                placeholder="Search channels..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-1 focus:ring-nexo-orange/20 outline-none"
              />
            </div>
          </div>

          {/* Channels List */}
          <div className="flex-1 overflow-y-auto p-2">
            {channels.map((channel) => (
              <div key={channel.id} className="group relative">
                <button
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors mb-1 ${
                    selectedChannel === channel.id 
                      ? 'bg-nexo-orange text-white' 
                      : 'text-nexo-mediumGray hover:bg-nexo-lightGray hover:text-nexo-navy'
                  }`}
                >
                  {channel.isPrivate ? <Lock className="w-4 h-4" /> : <Hash className="w-4 h-4" />}
                  <span className="text-sm font-medium flex-1 text-left">{channel.name}</span>
                  {channel.isPrivate && (
                    <span className="text-xs bg-nexo-orange/20 text-nexo-orange px-1 rounded">
                      {channel._count?.members || 0}
                    </span>
                  )}
                </button>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditChannel(channel)
                      }}
                      className="p-1 hover:bg-nexo-lightGray rounded text-nexo-mediumGray hover:text-nexo-navy"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    {channels.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteChannel(channel.id)
                        }}
                        className="p-1 hover:bg-red-100 rounded text-nexo-mediumGray hover:text-red-600"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Online Members */}
          <OnlineMembersSection communityId={currentCommunity?.id} />
        </div>

        {/* Main Feed */}
        <div className="flex-1 flex flex-col">
          {/* Feed Header */}
          <div className="bg-white border-b border-nexo-lightGray px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Hash className="w-5 h-5 text-nexo-mediumGray" />
                <h1 className="text-xl font-semibold text-nexo-navy">
                  {channels.find(c => c.id === selectedChannel)?.name || 'Channel'}
                </h1>
                <span className="text-sm text-nexo-mediumGray">
                  {posts.length} messages
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-nexo-lightGray rounded-lg">
                  <Filter className="w-4 h-4 text-nexo-mediumGray" />
                </button>
                <button className="p-2 hover:bg-nexo-lightGray rounded-lg">
                  <MoreHorizontal className="w-4 h-4 text-nexo-mediumGray" />
                </button>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-nexo-mediumGray mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-nexo-navy mb-2">No posts yet</h3>
                <p className="text-nexo-mediumGray">Be the first to start a conversation!</p>
              </div>
            ) : (
              posts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl border border-nexo-lightGray p-6 hover:shadow-lg transition-shadow">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-nexo-orange flex items-center justify-center text-white font-semibold">
                      {post.author.name?.[0] || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-nexo-navy">{post.author.name}</h3>
                        {post.isPinned && (
                          <Pin className="w-4 h-4 text-nexo-orange" />
                        )}
                      </div>
                      <p className="text-sm text-nexo-mediumGray">{new Date(post.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-nexo-lightGray rounded">
                    <MoreHorizontal className="w-4 h-4 text-nexo-mediumGray" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  {post.content && (
                    <p className="text-nexo-navy leading-relaxed mb-3">{post.content}</p>
                  )}
                  
                  {/* Attachments */}
                  {post.attachments && post.attachments.length > 0 && (
                    <div className="space-y-2">
                      {post.attachments.map((attachment: any, index: number) => (
                        <div key={index}>
                          {attachment.type?.startsWith('image/') ? (
                            <img 
                              src={attachment.url} 
                              alt={attachment.name}
                              className="max-w-sm rounded-lg border border-nexo-lightGray"
                            />
                          ) : (
                            <div className="flex items-center space-x-2 p-3 bg-nexo-lightGray rounded-lg max-w-sm">
                              <Paperclip className="w-4 h-4 text-nexo-mediumGray" />
                              <a 
                                href={attachment.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-nexo-orange hover:underline text-sm"
                              >
                                {attachment.name}
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reactions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={() => handleReaction(post.id)}
                      className="flex items-center space-x-1 px-2 py-1 rounded-full text-sm transition-colors bg-nexo-lightGray text-nexo-mediumGray hover:bg-nexo-orange/10 hover:text-nexo-orange"
                    >
                      <Heart className="w-4 h-4" />
                      <span className="text-xs font-medium">{post._count?.reactions || 0}</span>
                    </button>
                    
                    <div className="flex items-center space-x-4 text-nexo-mediumGray">
                      <button className="flex items-center space-x-1 hover:text-nexo-orange transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm">{post._count?.comments || 0}</span>
                      </button>
                      <button className="hover:text-nexo-orange transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-nexo-lightGray p-4">
            <form onSubmit={handleSubmitPost}>
              <div className="flex items-end space-x-3">
                <div className="w-8 h-8 rounded-full bg-nexo-orange flex items-center justify-center text-white font-semibold text-sm">
                  {session?.user?.name?.[0] || 'U'}
                </div>
                <div className="flex-1">
                  <div className="border border-nexo-lightGray rounded-lg p-3 focus-within:border-nexo-orange focus-within:ring-1 focus-within:ring-nexo-orange/20">
                    {/* Attachments Preview */}
                    {attachments.length > 0 && (
                      <div className="mb-3 space-y-2">
                        {attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-nexo-lightGray rounded">
                            <div className="flex items-center space-x-2">
                              {attachment.type?.startsWith('image/') ? (
                                <Image className="w-4 h-4 text-nexo-mediumGray" />
                              ) : (
                                <Paperclip className="w-4 h-4 text-nexo-mediumGray" />
                              )}
                              <span className="text-sm text-nexo-navy">{attachment.name}</span>
                            </div>
                            <button 
                              onClick={() => removeAttachment(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <textarea
                      value={newPost}
                      onChange={(e) => {
                        setNewPost(e.target.value)
                        e.target.style.height = 'auto'
                        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSubmitPost(e)
                        }
                      }}
                      placeholder={`Message #${channels.find(c => c.id === selectedChannel)?.name || 'channel'}`}
                      className="w-full resize-none outline-none text-nexo-navy placeholder-nexo-mediumGray min-h-[24px] max-h-[120px]"
                      rows={1}
                      style={{ height: '24px' }}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="file" 
                          id="file-upload" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file)
                          }}
                        />
                        <button 
                          type="button" 
                          onClick={() => document.getElementById('file-upload')?.click()}
                          disabled={uploading}
                          className="p-1 hover:bg-nexo-lightGray rounded disabled:opacity-50"
                        >
                          <Paperclip className="w-4 h-4 text-nexo-mediumGray" />
                        </button>
                        <input 
                          type="file" 
                          id="image-upload" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file)
                          }}
                        />
                        <button 
                          type="button" 
                          onClick={() => document.getElementById('image-upload')?.click()}
                          disabled={uploading}
                          className="p-1 hover:bg-nexo-lightGray rounded disabled:opacity-50"
                        >
                          <Image className="w-4 h-4 text-nexo-mediumGray" />
                        </button>
                        <button type="button" className="p-1 hover:bg-nexo-lightGray rounded">
                          <Smile className="w-4 h-4 text-nexo-mediumGray" />
                        </button>
                        {uploading && (
                          <span className="text-xs text-nexo-mediumGray">Uploading...</span>
                        )}
                      </div>
                      <button 
                        type="submit"
                        disabled={!newPost.trim() && !attachments.length}
                        className="btn-primary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Channel Modal */}
      {showChannelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-nexo-lightGray">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-nexo-navy">
                  {editingChannel ? 'Edit Channel' : 'Create Channel'}
                </h2>
                <button 
                  onClick={() => setShowChannelModal(false)}
                  className="text-nexo-mediumGray hover:text-nexo-navy"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSaveChannel} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-nexo-navy mb-2">
                  Channel Name *
                </label>
                <input 
                  type="text" 
                  value={channelForm.name}
                  onChange={(e) => setChannelForm({...channelForm, name: e.target.value})}
                  className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none"
                  placeholder="e.g. general, announcements"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-nexo-navy mb-2">
                  Description
                </label>
                <textarea 
                  rows={3}
                  value={channelForm.description}
                  onChange={(e) => setChannelForm({...channelForm, description: e.target.value})}
                  className="w-full px-4 py-3 border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-2 focus:ring-nexo-orange/20 outline-none resize-none"
                  placeholder="What is this channel about?"
                />
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input 
                    type="checkbox"
                    checked={channelForm.isPrivate}
                    onChange={(e) => setChannelForm({...channelForm, isPrivate: e.target.checked, memberIds: e.target.checked ? [] : channelForm.memberIds})}
                    className="w-4 h-4 text-nexo-orange border-nexo-lightGray rounded focus:ring-nexo-orange"
                  />
                  <span className="text-sm font-medium text-nexo-navy">Private Channel</span>
                </label>
                <p className="text-xs text-nexo-mediumGray mt-1">Only selected members can see and access this channel</p>
              </div>

              {channelForm.isPrivate && (
                <div>
                  <label className="block text-sm font-medium text-nexo-navy mb-2">
                    Select Members
                  </label>
                  <div className="relative mb-2">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-nexo-mediumGray" />
                    <input 
                      type="text" 
                      placeholder="Search members..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-nexo-lightGray rounded-lg focus:border-nexo-orange focus:ring-1 focus:ring-nexo-orange/20 outline-none"
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto border border-nexo-lightGray rounded-lg p-2 space-y-2">
                    {communityMembers
                      .filter(member => 
                        member.user.name?.toLowerCase().includes(memberSearch.toLowerCase()) ||
                        member.user.email?.toLowerCase().includes(memberSearch.toLowerCase())
                      )
                      .map((member) => (
                      <label key={member.user.id} className="flex items-center space-x-3 p-2 hover:bg-nexo-lightGray rounded cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={channelForm.memberIds.includes(member.user.id)}
                          onChange={() => toggleMember(member.user.id)}
                          className="w-4 h-4 text-nexo-orange border-nexo-lightGray rounded focus:ring-nexo-orange"
                        />
                        <div className="w-8 h-8 bg-nexo-orange rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {member.user.name?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-nexo-navy">{member.user.name}</p>
                          <p className="text-xs text-nexo-mediumGray">{member.user.email}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-nexo-mediumGray mt-1">
                    {channelForm.memberIds.length} of {communityMembers.filter(member => 
                      member.user.name?.toLowerCase().includes(memberSearch.toLowerCase()) ||
                      member.user.email?.toLowerCase().includes(memberSearch.toLowerCase())
                    ).length} members selected
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowChannelModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                >
                  {editingChannel ? 'Save Changes' : 'Create Channel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}