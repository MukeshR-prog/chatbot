'use client'

import { useQuery, useMutation } from '@apollo/client'
import { GET_CHATS, CREATE_CHAT, DELETE_CHAT, UPDATE_CHAT_TITLE } from '../lib/graphql'
import { PlusCircle, MessageSquare, Trash2, Edit3, Check, X } from 'lucide-react'
import { useState } from 'react'
import { useUserId } from '@nhost/nextjs'

export default function ChatList({ onSelectChat, selectedChatId }) {
  const userId = useUserId()
  const { loading, error, data, refetch } = useQuery(GET_CHATS, {
    variables: { userId: userId },
    skip: !userId,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network'
  })
  const [createChat, { loading: creatingChat }] = useMutation(CREATE_CHAT)
  const [deleteChat, { loading: deletingChat }] = useMutation(DELETE_CHAT)
  const [updateChatTitle, { loading: updatingTitle }] = useMutation(UPDATE_CHAT_TITLE)
  
  const [hoveredChatId, setHoveredChatId] = useState(null)
  const [editingChatId, setEditingChatId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')

  const handleCreateChat = async () => {
    if (!userId) {
      alert('You must be signed in to create a chat')
      return
    }
    
    try {
      const result = await createChat({
        variables: { 
          title: `New Chat ${new Date().toLocaleTimeString()}`,
          userId: userId
        },
        refetchQueries: [{ query: GET_CHATS, variables: { userId } }]
      })
      if (result.data?.insert_chats_one?.id) {
        onSelectChat(result.data.insert_chats_one.id)
      }
    } catch (e) {
      console.error('Error creating chat:', e)
      alert('Could not create a new chat. Please check your database setup.')
    }
  }

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      return
    }

    try {
      await deleteChat({
        variables: { id: chatId },
        refetchQueries: [{ query: GET_CHATS, variables: { userId } }]
      })
      
      // If this was the selected chat, clear selection
      if (selectedChatId === chatId) {
        onSelectChat(null)
      }
    } catch (e) {
      console.error('Error deleting chat:', e)
      alert('Could not delete chat. Please try again.')
    }
  }

  const handleStartEdit = (chatId, currentTitle, e) => {
    e.stopPropagation()
    setEditingChatId(chatId)
    setEditingTitle(currentTitle || 'Untitled Chat')
  }

  const handleSaveEdit = async (chatId, e) => {
    e.stopPropagation()
    
    if (!editingTitle.trim()) {
      setEditingTitle('Untitled Chat')
    }

    try {
      await updateChatTitle({
        variables: { 
          id: chatId, 
          title: editingTitle.trim() || 'Untitled Chat'
        },
        refetchQueries: [{ query: GET_CHATS, variables: { userId } }]
      })
      setEditingChatId(null)
      setEditingTitle('')
    } catch (e) {
      console.error('Error updating chat title:', e)
      alert('Could not update chat title. Please try again.')
    }
  }

  const handleCancelEdit = (e) => {
    e.stopPropagation()
    setEditingChatId(null)
    setEditingTitle('')
  }

  if (!userId) {
    return (
      <div className="flex flex-col p-6">
        <div className="text-center text-gray-500 mt-12 p-6">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={24} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600">Please sign in</p>
          <p className="text-xs mt-2 text-gray-500 leading-relaxed">
            Sign in to start chatting with AI
          </p>
        </div>
      </div>
    )
  }

  if (loading && !data) return (
    <div className="flex flex-col p-6">
      <div className="flex flex-row items-center justify-between text-sm mb-6">
        <span className="font-semibold text-gray-700">Conversations</span>
        <button
          onClick={handleCreateChat}
          disabled={creatingChat}
          className="flex items-center justify-center bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl h-8 w-8 disabled:opacity-50 transition-colors shadow-sm"
          title="New Chat"
        >
          <PlusCircle size={16} />
        </button>
      </div>
      <div className="animate-pulse space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
        ))}
      </div>
    </div>
  )

  if (error) return (
    <div className="flex flex-col p-6">
      <div className="flex flex-row items-center justify-between text-sm mb-6">
        <span className="font-semibold text-gray-700">Conversations</span>
        <button
          onClick={handleCreateChat}
          disabled={creatingChat}
          className="flex items-center justify-center bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl h-8 w-8 disabled:opacity-50 transition-colors shadow-sm"
          title="New Chat"
        >
          <PlusCircle size={16} />
        </button>
      </div>
      <div className="text-center p-6 text-red-500 bg-red-50 rounded-xl border border-red-100">
        <p className="text-sm font-medium">Connection Failed</p>
        <p className="text-xs mt-1 text-red-400">Please check your network</p>
        <button 
          onClick={() => refetch()} 
          className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-xs font-medium transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col p-6 h-full">
      <div className="flex flex-row items-center justify-between text-sm mb-6">
        <span className="font-semibold text-gray-700">Conversations</span>
        <button
          onClick={handleCreateChat}
          disabled={creatingChat}
          className="flex items-center justify-center bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-xl h-8 w-8 disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow-md"
          title="New Chat"
        >
          {creatingChat ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
          ) : (
            <PlusCircle size={16} />
          )}
        </button>
      </div>
      
      <div className="flex flex-col space-y-2 flex-1 overflow-y-auto">
        {data?.chats?.length > 0 ? (
          data.chats.map((chat) => (
            <div
              key={chat.id}
              className={`relative group flex flex-row items-center hover:bg-gray-50 rounded-xl p-4 text-left transition-all duration-200 cursor-pointer ${
                selectedChatId === chat.id 
                  ? 'bg-indigo-50 border-2 border-indigo-200 shadow-sm' 
                  : 'border-2 border-transparent hover:border-gray-100'
              }`}
              onMouseEnter={() => setHoveredChatId(chat.id)}
              onMouseLeave={() => setHoveredChatId(null)}
              onClick={() => editingChatId !== chat.id && onSelectChat(chat.id)}
            >
              <div className={`flex items-center justify-center rounded-lg h-10 w-10 mr-3 flex-shrink-0 ${
                selectedChatId === chat.id 
                  ? 'bg-indigo-100 text-indigo-600' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                <MessageSquare size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                {editingChatId === chat.id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="flex-1 text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      onClick={(e) => e.stopPropagation()}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveEdit(chat.id, e)
                        } else if (e.key === 'Escape') {
                          handleCancelEdit(e)
                        }
                      }}
                      autoFocus
                    />
                    <button
                      onClick={(e) => handleSaveEdit(chat.id, e)}
                      disabled={updatingTitle}
                      className="p-1 text-green-600 hover:text-green-700 transition-colors"
                      title="Save"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Cancel"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={`text-sm font-medium truncate ${
                      selectedChatId === chat.id ? 'text-indigo-900' : 'text-gray-900'
                    }`}>
                      {chat.title || 'Untitled Chat'}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {new Date(chat.updated_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Action buttons (visible on hover) */}
              {hoveredChatId === chat.id && editingChatId !== chat.id && (
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => handleStartEdit(chat.id, chat.title, e)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-all duration-200"
                    title="Rename chat"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    disabled={deletingChat}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200 disabled:opacity-50"
                    title="Delete chat"
                  >
                    {deletingChat ? (
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border border-red-500 border-t-transparent"></div>
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-12 p-6">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={24} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-600">No conversations yet</p>
            <p className="text-xs mt-2 text-gray-500 leading-relaxed">
              Start your first chat by clicking the + button above
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
