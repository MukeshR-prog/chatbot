import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import { split } from '@apollo/client/link/core'

export function createApolloClient(nhost) {
  const httpLink = createHttpLink({
    uri: `https://${process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN}.graphql.${process.env.NEXT_PUBLIC_NHOST_REGION}.nhost.run/v1`,
  })

  // Disable WebSocket for now - use HTTP only
  const wsLink = null

  const authLink = setContext(async (_, { headers }) => {
    // This function now only needs to provide the authorization token.
    // Hasura will extract the user-id and other claims directly from the JWT.
    try {
      await nhost.auth.isAuthenticatedAsync();
    } catch {
      // This can happen on initial load, it's okay.
    }

    const token = nhost.auth.getAccessToken();

    if (!token) {
      console.log('Auth link: No token available.');
      return { headers };
    }

    console.log('Auth link: Sending Authorization header.');
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      )
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`)
    }
  })

  const splitLink = authLink.concat(httpLink)

  return new ApolloClient({
    link: from([errorLink, splitLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
      query: {
        errorPolicy: 'all',
      },
    },
  })
}