import useSWR from 'swr';
import axios from 'axios';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function UsegetLeads() {
  const URL = endpoints.leads.list;
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

export function UsegetLead(productId) {
  const URL = productId ? endpoints.leads.details(productId) : null;

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

export function UseSearchLead(query) {
  const URL = query ? [endpoints.leads.search, { params: { query } }] : '';

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

// export const CreateLead = async (data) => {
//   const response = await axios.post(endpoints.leads.create, data);
//   return response.data;
// };

export const CreateLead = async (formData, token) => {
  try {
    console.log(formData, token);

    const response = await axios.post(endpoints.leads.create, formData, {
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

// Update user
// export const UpdateLead = async (id, data) => {
//   const response = await axios.put(endpoints.leads.details(id), data);
//   return response.data;
// };

export const UpdateLead = async (id, formData, token) => {
  try {
    console.log(formData, token);

    const response = await axios.put(endpoints.leads.details(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error update property:', error);
    return null;
  }
};

//  delete user
export const DeleteLead = async (id) => {
  const response = await axios.delete(endpoints.leads.details(id));
  return response.data;
};

//  Match Lead
export const MatchLead = async (id) => {
  const response = await axios.get(endpoints.leads.match(id));
  return response.data;
};

//  Select Lead
export const SelectLead = async (id, data) => {
  try {
    const response = await axios.post(endpoints.leads.select(id), data);

    return response.data;
  } catch (error) {
    console.error('Error update property:', error);
    return null;
  }
};

// Getting  Selected Lead
export const SelectedLead = async (id) => {
  const response = await axios.get(endpoints.leads.select(id));
  return response.data;
};


//Create Follow Up by lead_id
export const CreateFollowUp = async (data, id) => {
  try {
    // Add lead_id to the data object
    const updatedData = {
      ...data, // Copy existing data
      lead_id: id // Add the lead_id key with the value of id
    };

    const response = await axios.post(endpoints.followup.create, updatedData);

    return response.data;
  } catch (error) {
    console.error('Error Create FollowUp:', error);
    return null;
  }
}

export function UsegetFollowupProperty(RowID) {
  const URL = RowID ? endpoints.followup.specificRow(RowID) : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      product: data?.data[0],
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function UsegetFollowupDetail(LeadId) {
  const URL = LeadId ? endpoints.leads.details(LeadId) : null;

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

export const UpdateFollowUp = async (id, data, token) => {
  console.log("==============>", data);
  try {

    const response = await axios.put(endpoints.followup.update(id), data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error update property:', error);
    return null;
  }
};

export const DeleteFollowUp = async (id) => {
  const response = await axios.delete(endpoints.followup.deleteSingle(id));
  return response.data;
};


export const DeleteMultipleFollowUp = async (ids) => {
  const idString = ids.join(',');
  const response = await axios.delete(endpoints.followup.deleteSingle(idString));
  return response.data;
};

