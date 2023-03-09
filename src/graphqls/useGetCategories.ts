import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { Category } from '~/types/category.type';

interface Response {
  getCategories: Category[];
}

export function useGetCategories(includeArchived = false) {

  const { data } = useQuery<Response>(
    gql`
      query GetCategories($includeArchived: Boolean!) {
        getCategories(includeArchived: $includeArchived) {
          code
          archived
          label
        }
      }
    `,
    { variables: { includeArchived } }
  );

  return useMemo(() => data?.getCategories, [data]);
}
