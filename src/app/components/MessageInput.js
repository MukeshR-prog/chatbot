'use client'

import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { INSERT_MESSAGE, SEND_MESSAGE_ACTION } from '../lib/graphql'
import { Send } from 'lucide-react'

export default function MessageInput({ chatId }) {
  const [message, setMessage] = useState('')
  const [insertMessage, { loading: inserting }] = useMutation(INSERT_MESSAGE)
  const [sendMessageAction, { loading: sendingToAction }] = useMutation(SEND_MESSAGE_ACTION)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const content = message.trim()
    if (!content || !chatId) return

    setMessage('') // Clear input immediately for better UX

    try {
      // 1. Save user message to the database
      await insertMessage({
        variables: {
          chatId: chatId,
          content: content,
        },
      })

      // 2. Call the Hasura Action to trigger the chatbot
      await sendMessageAction({
        variables: {
          chat_id: chatId,
          message: content,
        },
      })
      // The chatbot's response will appear automatically via the subscription in ChatWindow
    } catch (err) {
      console.error('Error sending message:', err)
      // Optional: Add the message back to the input if sending failed
      setMessage(content)
      alert('Failed to send message. Please check the console and try again.')
    }
  }

  const isLoading = inserting || sendingToAction

  return (
    <form onSubmit={handleSubmit} className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
      <div className="flex-grow ml-4">
        <div className="relative w-full">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
            placeholder="Type your message..."
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="ml-4">
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0 disabled:opacity-50"
        >
          <span>Send</span>
          <span className="ml-2">
            <Send size={18} />
          </span>
        </button>
      </div>
    </form>
  )
}