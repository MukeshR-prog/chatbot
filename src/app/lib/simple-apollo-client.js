// SIMPLIFIED Apollo Client - Backup version
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

export function createSimpleApolloClient(nhost) {
  const httpLink = createHttpLink({
    uri: `https://${process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN}.graphql.${process.env.NEXT_PUBLIC_NHOST_REGION}.nhost.run/v1`,
  })

  const authLink = setContext((_, { headers }) => {
    const token = nhost.auth.getAccessToken()
    const user = nhost.auth.getUser()
    
    console.log('Simple Apollo - Token exists:', !!token, 'User ID:', user?.id)
    
    return {
      headers: {
        ...headers,
        ...(token && { 
          'Authorization': `Bearer ${token}`,
          'x-hasura-admin-secret': '', // Remove this line if you don't have admin secret
        }),
      }
    }
  })

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { errorPolicy: 'all' },
      query: { errorPolicy: 'all' },
    },
  })
}
