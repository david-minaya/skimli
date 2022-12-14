/*
 * Copyright (c) 2022. Skimli LLC. All rights reserved.
 * Proprietary and can not be copied without the express permission of Skimli LLC.
 * Do not distribute outside Skimli LLC.
 */

import { useCallback, useEffect, useState } from "react";
import * as Sentry from "@sentry/nextjs";
import {
  ApolloClient,
  DefaultOptions,
  DocumentNode,
  InMemoryCache,
} from "@apollo/client";

const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};

const client = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_CONTENTFUL_GRAPHQL_ENDPOINT}/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}/environments/${process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT_ID}?access_token=${process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_ACCESS_TOKEN}`,
  cache: new InMemoryCache(),
  defaultOptions,
});

const useContentful = (query: DocumentNode) => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>();

  const runQuery = useCallback(async () => {
    setLoading(true);
    try {
      const { data: result, error } = await client.query({ query });
      setLoading(false);
      if (error) {
        Sentry.withScope((scope) => {
          scope.setFingerprint(["3rd-party", "contentful"]);
          Sentry.captureException(error);
        });

        setError(error);
      } else setData(result);
    } catch (error) {
      setLoading(false);
      setError(true);

      Sentry.withScope((scope) => {
        scope.setFingerprint(["3rd-party", "contentful"]);
        Sentry.captureException(error);
      });
    }
  }, [query]);

  useEffect(() => {
    runQuery();
  }, [runQuery]);

  return {
    loading,
    data,
    error,
  };
};

export default useContentful;
