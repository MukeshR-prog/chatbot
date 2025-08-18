'use client'

import { useAuthenticationStatus } from '@nhost/nextjs'
import AuthForm from './AuthForm'
import LoadingSpinner from './LoadingSpinner'

export default function AuthGuard({ children }) {
  const { isAuthenticated, isLoading } = useAuthenticationStatus()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <AuthForm />
  }

  return children
}