import axios from 'axios';
import { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache } from "@apollo/client";

export function useApollo() {

  const [token, setToken] = useState();

  useEffect(() => {

    (async () => {

      try {
    
        const res = await axios.get('/api/token', { timeout: 5000 });
    
        setToken(res.data.accessToken);
    
      } catch (error) {
        
        setToken(undefined);
      }
    })();
  }, []);

  if (!token) return;

  return new ApolloClient({
    uri: process.env.NEXT_PUBLIC_GRAPH_API || '/api/graphql',
    cache: new InMemoryCache(),
    credentials: 'same-origin',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
