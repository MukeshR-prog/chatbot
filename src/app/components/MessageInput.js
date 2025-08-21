'use client'

import { useState, useRef, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { INSERT_MESSAGE, SEND_MESSAGE_ACTION } from '../lib/graphql'
import { Send, Loader2, Paperclip, Smile } from 'lucide-react'
import { useUserId } from '@nhost/nextjs'

export default function MessageInput({ chatId, onMessageSent }) {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const textareaRef = useRef(null)
  const userId = useUserId()
  const [insertMessage, { loading: inserting }] = useMutation(INSERT_MESSAGE)
  const [sendMessageAction, { loading: sendingToAction }] = useMutation(SEND_MESSAGE_ACTION)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }, [message])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const content = message.trim()
    if (!content || !chatId || !userId) return

    setMessage('') // Clear input immediately for better UX
    setIsTyping(true)

    try {
      // 1. Save user message to the database
      await insertMessage({
        variables: {
          chatId: chatId,
          content: content,
          sender: 'user',
        },
      })

      // Trigger refetch of messages
      if (onMessageSent) onMessageSent()

      // 2. Get AI response from our API
      try {
        const aiResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: content,
            chatId: chatId,
          }),
        });

        const aiData = await aiResponse.json();

        if (aiData.success) {
          // Add the AI response to the chat
          setTimeout(async () => {
            await insertMessage({
              variables: {
                chatId: chatId,
                content: aiData.response,
                sender: 'bot',
              },
            });
            // Trigger refetch again for bot response
            if (onMessageSent) onMessageSent();
            setIsTyping(false);
          }, 500);
        } else {
          // Fallback message if AI fails
          setTimeout(async () => {
            await insertMessage({
              variables: {
                chatId: chatId,
                content: aiData.error || "Sorry, I'm having trouble responding right now. Please try again.",
                sender: 'bot',
              },
            });
            if (onMessageSent) onMessageSent();
            setIsTyping(false);
          }, 500);
        }
      } catch (aiError) {
        console.log('AI API error:', aiError);
        // Fallback to placeholder response if AI completely fails
        setTimeout(async () => {
          await insertMessage({
            variables: {
              chatId: chatId,
              content: "I'm having trouble connecting to my AI brain right now. Please try again!",
              sender: 'bot',
            },
          });
          if (onMessageSent) onMessageSent();
          setIsTyping(false);
        }, 500);
      }
    } catch (err) {
      console.error('Error sending message:', err)
      setMessage(content) // Restore message if error
      setIsTyping(false)
      alert('Failed to send message. Please try again.')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const isLoading = inserting || sendingToAction || isTyping

  return (
    <div className="relative">
      {/* Typing Indicator */}
      {isTyping && (
        <div className="absolute -top-8 left-0 flex items-center space-x-2 text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span>AI is thinking...</span>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-end space-x-2 sm:space-x-3">
        {/* Message Input Container */}
        <div className="flex-1 relative">
          <div className="relative bg-gray-50 rounded-2xl border border-gray-200  focus-within:border-transparent transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 pr-12 bg-transparent rounded-2xl border-none resize-none focus:outline-none focus-within:ring-indigo-500 placeholder-gray-500 text-gray-900 text-sm sm:text-base leading-relaxed min-h-[50px] max-h-[120px] items-center justify-center"
              placeholder="Type your message..."
              disabled={isLoading}
              rows="1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            />
            
            {/* Emoji Button - Hidden on small screens */}
            <button
              type="button"
              className="absolute right-3 bottom-4.5 text-gray-400 hover:text-gray-600 transition-colors duration-200 hidden sm:block"
              disabled={isLoading}
            >
              <Smile size={20} />
            </button>
          </div>

          {/* Character Counter for long messages */}
          {message.length > 500 && (
            <div className="absolute -top-6 right-0 text-xs text-gray-400">
              {message.length}/2000
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="min-h-[60px] flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl px-4 py-3 sm:px-6 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-600 disabled:hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
          <span className="ml-2 hidden sm:inline text-sm">
            {isLoading ? 'Sending...' : 'Send'}
          </span>
        </button>
      </form>

    
    </div>
  )
}