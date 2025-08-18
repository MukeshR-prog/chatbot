'use client'

import { useState } from 'react'
import ChatList from './ChatList'
import ChatWindow from './ChatWindow'
import { useSignOut } from '@nhost/nextjs'
import { LogOut } from 'lucide-react'

export default function ChatLayout() {
  const [selectedChatId, setSelectedChatId] = useState(null)
  const { signOut } = useSignOut()

  return (
    <div className="flex h-screen antialiased text-gray-800">
      <div className="flex flex-row h-full w-full overflow-x-hidden">
        {/* Sidebar */}
        <div className="flex flex-col py-8 pl-6 pr-2 w-80 bg-white flex-shrink-0">
          <div className="flex flex-row items-center justify-between h-12 w-full">
            <div className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
            </div>
            <div className="ml-2 font-bold text-2xl">Chatbot</div>
            <button onClick={signOut} className="p-2 rounded-full hover:bg-gray-200" title="Sign Out">
              <LogOut size={20} />
            </button>
          </div>
          <ChatList onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
        </div>

        {/* Chat Window */}
        <ChatWindow chatId={selectedChatId} />
      </div>
    </div>
  )
}