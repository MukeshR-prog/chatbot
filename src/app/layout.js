
"use client"
import { Inter } from 'next/font/google'
import './globals.css'
import { NhostProvider } from '@nhost/nextjs'
import { ApolloWrapper } from './components/ApolloWrapper'
import { nhost } from './lib/nhost'

const inter = Inter({ subsets: ['latin'] })

 const metadata = {
  title: 'Chatbot App',
  description: 'AI-powered chatbot application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NhostProvider nhost={nhost}>
          <ApolloWrapper>
            {children}
          </ApolloWrapper>
        </NhostProvider>
      </body>
    </html>
  )
}