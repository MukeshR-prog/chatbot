'use client'

import { ApolloProvider } from '@apollo/client'
import { useNhostClient, useAuthenticationStatus } from '@nhost/nextjs'
import { createApolloClient } from '../lib/apollo-client'
import { useMemo } from 'react'

export function ApolloWrapper({ children }) {
  const nhost = useNhostClient()
  const { isAuthenticated, isLoading } = useAuthenticationStatus()
  
  const apolloClient = useMemo(() => {
    return createApolloClient(nhost)
  }, [nhost])

  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  )
}