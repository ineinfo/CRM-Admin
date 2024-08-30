import useSWR from 'swr';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { COUNTRY_ROUTE } from 'src/utils/apiendpoints';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function UsegetPropertiesType() {
  const URL = endpoints.propertytype.list;

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

export function UsegetPropertyType(productId) {
  const URL = productId ? endpoints.propertytype.details(productId) : null;

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

export function useSearchProperty(query) {
  const URL = query ? [endpoints.propertytype.search, { params: { query } }] : '';

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


export const createProperty = async (data) => {
  const response = await axios.post(endpoints.propertytype.create, data);
  return response.data;
};


// Update role
export const updateProperty = async (id, data) => {
  const response = await axios.put(endpoints.propertytype.details(id), data);
  return response.data;
};

// Update role
export const deletePropertytype = async (id) => {
  const response = await axios.delete(endpoints.propertytype.details(id));
  return response.data;
};




//----------------------------------------------
//Country Data

export function useCountryData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response = await axios.get(COUNTRY_ROUTE);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, []); // Empty dependency array ensures this runs once on mount

  const memoizedValue = useMemo(() => ({
    data,
    loading,
    error,
    empty: !loading && !data?.length,
  }), [data, loading, error]); // Dependencies for memoization

  return memoizedValue;
}