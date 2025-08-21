
'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { NhostProvider } from '@nhost/nextjs'
import { ApolloWrapper } from './components/ApolloWrapper'
import { nhost } from './lib/nhost'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#6366f1" />
        <meta name="description" content="Advanced AI chatbot application with real-time conversations, secure authentication, and responsive design. Powered by Claude 3 Haiku." />
        <meta name="keywords" content="AI chatbot, Claude 3, Haiku, artificial intelligence, conversation, chat, Next.js" />
        <meta name="author" content="AI Chatbot Team" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AI Chatbot - Powered by Claude 3 Haiku" />
        <meta property="og:description" content="Advanced AI chatbot application with real-time conversations, secure authentication, and responsive design. Powered by Claude 3 Haiku." />
        <meta property="og:site_name" content="AI Chatbot" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Chatbot - Powered by Claude 3 Haiku" />
        <meta name="twitter:description" content="Advanced AI chatbot application with real-time conversations, secure authentication, and responsive design. Powered by Claude 3 Haiku." />
        
        {/* Apple specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AI Chatbot" />
        
        {/* Favicon */}
        <link rel="icon" href="/bot.png" type="image/png" />
        <link rel="apple-touch-icon" href="/bot.png" />
        
        <title>AI Chatbot - Powered by Claude 3 Haiku</title>
      </head>
      <body className={`${inter.className} antialiased bg-white text-gray-900`}>
        <NhostProvider nhost={nhost}>
          <ApolloWrapper>
            <div id="root" className="min-h-screen">
              {children}
            </div>
          </ApolloWrapper>
        </NhostProvider>
      </body>
    </html>
  )
}