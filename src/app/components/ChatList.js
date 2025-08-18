'use client'

import { useQuery, useMutation } from '@apollo/client'
import { GET_CHATS, CREATE_CHAT } from '../lib/graphql'
import { PlusCircle } from 'lucide-react'

export default function ChatList({ onSelectChat, selectedChatId }) {
  const { loading, error, data, refetch } = useQuery(GET_CHATS)
  const [createChat, { loading: creatingChat }] = useMutation(CREATE_CHAT)

  const handleCreateChat = async () => {
    try {
      const result = await createChat({
        variables: { title: 'New Chat' },
      })
      if (result.data?.insert_chats_one?.id) {
        await refetch() // Refetch the list to include the new chat
        onSelectChat(result.data.insert_chats_one.id) // Select the new chat
      }
    } catch (e) {
      console.error('Error creating chat:', e)
      alert('Could not create a new chat. Please try again.')
    }
  }

  if (loading) return <p className="text-center mt-4">Loading chats...</p>
  if (error) return <p className="text-center mt-4 text-red-500">Error: {error.message}</p>

  return (
    <div className="flex flex-col mt-8">
      <div className="flex flex-row items-center justify-between text-xs">
        <span className="font-bold">Conversations</span>
        <button
          onClick={handleCreateChat}
          disabled={creatingChat}
          className="flex items-center justify-center bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full h-8 w-8 disabled:opacity-50"
          title="New Chat"
        >
          <PlusCircle size={20} />
        </button>
      </div>
      <div className="flex flex-col space-y-1 mt-4 -mx-2 h-full overflow-y-auto">
        {data?.chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`flex flex-row items-center hover:bg-gray-100 rounded-xl p-2 text-left ${selectedChatId === chat.id ? 'bg-gray-200' : ''}`}
          >
            <div className="ml-2 text-sm font-semibold">{chat.title || 'Chat'}</div>
          </button>
        ))}
        {data?.chats.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No chats yet. Start a new one!</p>
        )}
      </div>
    </div>
  )
}