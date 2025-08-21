'use client'

import { useAuthenticationStatus, useUserId } from '@nhost/nextjs'
import AuthForm from './AuthForm'
import LoadingSpinner from './LoadingSpinner'

export default function AuthGuard({ children }) {
  const { isAuthenticated, isLoading } = useAuthenticationStatus()
  const userId = useUserId()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <AuthForm />
  }

  return children
}