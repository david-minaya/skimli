import axios from 'axios';
import { useState, useEffect, useMemo } from 'react';
import { ApolloClient, InMemoryCache } from "@apollo/client";

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
    return new ApolloClient({
      uri: process.env.NEXT_PUBLIC_GRAPH_API || '/api/graphql',
      cache: new InMemoryCache(),
      credentials: 'same-origin',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }, [token]);

  if (token) {
    return client;
  }
}
