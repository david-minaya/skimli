import { ApolloClient, InMemoryCache } from '@apollo/client';

export const contentful = new ApolloClient({
  uri:   
    `${process.env.NEXT_PUBLIC_CONTENTFUL_GRAPHQL_ENDPOINT}` +
    '/spaces' +
    `/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}` +
    '/environments' +
    `/${process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT_ID}` +
    `?access_token=${process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_ACCESS_TOKEN}`,
  cache: new InMemoryCache(),
  credentials: 'same-origin'
});
