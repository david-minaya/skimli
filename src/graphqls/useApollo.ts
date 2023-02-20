import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

export function useApollo() {

  const [token, setToken] = useState<string>();

  useEffect(() => {

    (async () => {

      try {
    
        const res = await axios.get('/api/token', { timeout: 5000 });
    
        setToken(res.data.accessToken);
    
      } catch (error) {
        
        setToken('invalid');
      }
    })();
  }, []);

  const client = useMemo(() => {

    if (typeof window === 'undefined') return;

    const httpLink = new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPH_API || '/api/graphql',
      credentials: 'same-origin',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const wsLink = new GraphQLWsLink(createClient({
      url: process.env.NEXT_PUBLIC_GRAPH_WSS || 'wss://localhost:3001/api/graphql',
      connectionParams: {
        Authorization: `Bearer ${token}`
      }
    }));

    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httpLink,
    );

    return new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache()
    });
  }, [token]);

  if (token) {
    return client;
  }
}
