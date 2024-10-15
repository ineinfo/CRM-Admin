import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const URL = endpoints.calendar;

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetEvents() {
  const URL = endpoints.calendar.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      events: data?.data,
      eventsLoading: isLoading,
      eventsError: error,
      eventsValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function createEvent(eventData, token) {
  try {
    const response = await axios.post(endpoints.calendar.create, eventData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Revalidate or update cache after creation
    mutate(endpoints.calendar.list);

    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    return null;
  }
}

// ----------------------------------------------------------------------

export async function updateEvent(id, eventData, token) {
  try {
    const response = await axios.put(endpoints.calendar.update(id), eventData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Revalidate or update cache after update
    mutate(endpoints.calendar.list);

    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    return null;
  }
}

// ----------------------------------------------------------------------

export async function deleteEvent(eventId, token) {
  try {
    const response = await axios.delete(endpoints.calendar.deleteSingle(eventId), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Revalidate or update cache after deletion
    mutate(endpoints.calendar.list);

    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    return null;
  }
}
