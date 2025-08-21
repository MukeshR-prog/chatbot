'use client'

import { useState } from 'react'
import ChatList from './ChatList'
import ChatWindow from './ChatWindow'
import { useSignOut } from '@nhost/nextjs'
import { LogOut, Menu, X } from 'lucide-react'
import Image from 'next/image'

export default function ChatLayout() {
  const [selectedChatId, setSelectedChatId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { signOut } = useSignOut()

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center rounded-xl text-white bg-white bg-opacity-20 h-10 w-10">
              <Image src="/bot.png" alt="Logo" width={40} height={40}/>
              </div>
              <h1 className="text-xl font-bold text-white">AI Chatbot</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={signOut} 
                className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 text-white transition-colors" 
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-20 text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          {/* Chat List */}
          <div className="flex-1 overflow-hidden">
            <ChatList 
              onSelectChat={(chatId) => {
                setSelectedChatId(chatId)
                setSidebarOpen(false) // Close sidebar on mobile when chat is selected
              }}
              selectedChatId={selectedChatId}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {selectedChatId ? 'Chat' : 'AI Chatbot'}
          </h1>
          <button 
            onClick={signOut} 
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors" 
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>

        {/* Chat content */}
        <div className="flex-1 overflow-hidden">
          {selectedChatId ? (
            <ChatWindow 
              chatId={selectedChatId} 
              onBack={() => setSelectedChatId(null)} // For mobile back navigation
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Welcome to AI Chatbot
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Start a conversation with our AI assistant powered by Claude 3. Create a new chat or select an existing one from the sidebar.
                </p>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg"
                >
                  Open Chats
                </button>
                <p className="hidden lg:block text-sm text-gray-500 mt-4">
                  Click the + button in the sidebar to start a new conversation
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}