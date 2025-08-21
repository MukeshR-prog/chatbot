
"use client";
import AuthGuard from './components/AuthGuard'
import ChatLayout from './components/ChatLayout'

export default function Home() {
  return (
    <main>
      <AuthGuard>
        <ChatLayout />
      </AuthGuard>
    </main>
  )
}