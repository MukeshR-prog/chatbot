'use client'

import { useEffect, useRef } from 'react'
import { useSubscription } from '@apollo/client'
import { GET_MESSAGES } from '../lib/graphql'
import MessageInput from './MessageInput'

export default function ChatWindow({ chatId }) {
  const { data, loading, error } = useSubscription(GET_MESSAGES, {
    variables: { chatId },
    skip: !chatId, // Don't run the subscription if no chat is selected
  })
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [data]) // Scroll to bottom whenever new messages arrive

  if (!chatId) {
    return (
      <div className="flex flex-col flex-auto h-full p-6 items-center justify-center">
        <p className="text-xl text-gray-500">Select a chat to start messaging</p>
      </div>
    )
  }

  if (loading) {
    return <div className="flex flex-col flex-auto h-full p-6 items-center justify-center"><p>Loading messages...</p></div>
  }

  if (error) {
    return <div className="flex flex-col flex-auto h-full p-6 items-center justify-center"><p className="text-red-500">Error: {error.message}</p></div>
  }

  return (
    <div className="flex flex-col flex-auto h-full p-6">
      <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
        <div className="flex flex-col h-full overflow-x-auto mb-4">
          <div className="flex flex-col h-full">
            <div className="grid grid-cols-12 gap-y-2">
              {data?.messages.map((msg) => (
                msg.is_bot ? (
                  // Bot Message
                  <div key={msg.id} className="col-start-1 col-end-11 p-3 rounded-lg">
                    <div className="flex flex-row items-center">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 text-white">
                        B
                      </div>
                      <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                        <div>{msg.content}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // User Message
                  <div key={msg.id} className="col-start-3 col-end-13 p-3 rounded-lg">
                    <div className="flex items-center justify-start flex-row-reverse">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0 text-white">
                        U
                      </div>
                      <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                        <div>{msg.content}</div>
                      </div>
                    </div>
                  </div>
                )
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
        <MessageInput chatId={chatId} />
      </div>
    </div>
  )
}