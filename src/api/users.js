import useSWR from 'swr';
import axios from 'axios';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function UsegetUserss() {
  const URL = endpoints.users.list;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      products: data?.data || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );
  return memoizedValue;
}

// ----------------------------------------------------------------------

export function UsegetUsers(productId) {
  const URL = productId ? endpoints.users.details(productId) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      product: data?.data,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchUser(query) {
  const URL = query ? [endpoints.users.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.data || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}


export const createUser = async (formData) => {
  const response = await axios.post(endpoints.users.create, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};


// Update user
export const updateUser = async (id, formData) => {
  const response = await axios.put(endpoints.users.details(id), formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

//  delete user 
export const deleteUser = async (id) => {
  const response = await axios.delete(endpoints.users.details(id));
  return response.data;
};
