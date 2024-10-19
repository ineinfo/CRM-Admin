import useSWR from 'swr';
import axios from 'axios';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function UsegetProperties() {
  const URL = endpoints.propertypage.list;

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

export function UsegetProperty(productId) {
  const URL = productId ? endpoints.propertypage.details(productId) : null;

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

export function UsegetProspect(productId) {
  const URL = productId ? endpoints.opportunity.details(productId) : null;

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

export function UseSearchProperty(query) {
  const URL = query ? [endpoints.propertypage.search, { params: { query } }] : '';

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

//create prospect

export const CreateProspect = async (formData, token) => {
  try {
    console.log(formData, token);

    const response = await axios.post(endpoints.opportunity.create, formData, {
      headers: {

        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error creating property:', error);
    return null;
  }
};

//update prospect
export const UpdateProspect = async (id, formData, token) => {
  const response = await axios.put(endpoints.opportunity.details(id), formData, {
    headers: {

      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const CreateProperty = async (formData, token) => {
  try {
    console.log(formData, token);

    const response = await axios.post(endpoints.propertypage.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error creating property:', error);
    return null;
  }
};

// Update role
export const UpdateProperty = async (id, formData, token) => {
  const response = await axios.put(endpoints.propertypage.details(id), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update role
export const DeleteProperty = async (id) => {
  const response = await axios.delete(endpoints.propertypage.details(id));
  return response.data;
};


// Update prospect
export const DeleteProspect = async (id) => {
  const response = await axios.delete(endpoints.opportunity.details(id));
  return response.data;
};
