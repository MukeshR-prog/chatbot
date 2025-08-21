'use client'

import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_MESSAGES } from '../lib/graphql'
import MessageInput from './MessageInput'
import { Bot, User, MessageSquare } from 'lucide-react'

export default function ChatWindow({ chatId }) {
  const { data, loading, error, refetch } = useQuery(GET_MESSAGES, {
    variables: { chatId },
    skip: !chatId,
    errorPolicy: 'all',
    pollInterval: 30000, // Reduced from 20s to 30s for less frequent polling
  })
  const messagesEndRef = useRef(null)
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true)

  const scrollToBottom = () => {
    if (isAutoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    if (isAutoScrollEnabled) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [data?.messages, isAutoScrollEnabled])

  if (!chatId) {
    return (
      <div className="flex flex-col flex-auto h-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
        <div className="text-center max-w-md">
          <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm">
            <MessageSquare size={48} className="mx-auto mb-3 text-indigo-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Welcome to AI Chatbot</h3>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Select a conversation from the sidebar or create a new one to start chatting with our AI assistant
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col flex-auto h-full items-center justify-center bg-gray-50 p-4 sm:p-6">
        <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-200 max-w-md">
          <div className="mb-4 p-3 bg-red-100 rounded-full w-fit mx-auto">
            <MessageSquare size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-700 mb-2">Connection Error</h3>
          <p className="text-red-600 text-sm mb-1">Unable to load messages</p>
          <p className="text-red-500 text-xs mb-4 break-words">{error.message}</p>
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-auto h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center min-w-0 flex-1">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white mr-3 flex-shrink-0">
            <Bot size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-gray-900 truncate">AI Assistant</h2>
            <p className="text-sm text-gray-500">Powered by Claude 3 Haiku</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500 hidden sm:inline">Online</span>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="h-full overflow-y-auto p-3 sm:p-4 space-y-1">
          {loading && !data ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-3 border-indigo-600 border-t-transparent mx-auto mb-3"></div>
                <p className="text-gray-500 text-sm">Loading messages...</p>
              </div>
            </div>
          ) : data?.messages?.length > 0 ? (
            <div className="space-y-4 sm:space-y-6">
              {data.messages.map((msg) => {
                const isBot = msg.sender === 'bot' || msg.sender === 'assistant'
                return (
                  <div key={msg.id} className={`flex items-end space-x-2 ${isBot ? 'justify-start' : 'justify-start flex-row-reverse space-x-reverse'}`}>
                    <div className={`flex items-center justify-center h-8 w-8 rounded-full flex-shrink-0 ${
                      isBot 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' 
                        : 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white'
                    }`}>
                      {isBot ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className={`max-w-[75%] sm:max-w-[65%] lg:max-w-md ${isBot ? 'order-2' : 'order-1'}`}>
                      <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                        isBot 
                          ? 'bg-white border border-gray-200 text-gray-800 rounded-bl-md' 
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-md'
                      }`}>
                        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                          {msg.content}
                        </p>
                      </div>
                      <p className={`text-xs mt-1 px-2 ${
                        isBot ? 'text-gray-500 text-left' : 'text-gray-400 text-right'
                      }`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6">
                <div className="mb-4 p-4 bg-indigo-50 rounded-2xl w-fit mx-auto">
                  <MessageSquare size={32} className="text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Start the conversation</h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  Send a message below to begin chatting with the AI assistant
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 bg-white p-3 sm:p-4">
        <MessageInput chatId={chatId} onMessageSent={() => refetch()} />
      </div>
    </div>
  )
}