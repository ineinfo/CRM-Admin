import axios from 'axios';

import { HOST_API } from 'src/config-global';

import {
  USER_ROUTE,
  ROLES_ROUTE,
  LEADS_ROUTE,
  CLIENTS_ROUTE,
  AMENITIES_ROUTE,
  PROPERTY_TYPE_ROUTE,
  PROPERTIES_ROUTE,
  PARKING_TYPE_ROUTE,
  COUNCIL_TAX_BAND,
  PROPERTY_STATUS,
  FINANCE,
} from './apiendpoints';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  roles: {
    list: ROLES_ROUTE,
    create: ROLES_ROUTE,
    details: (id) => `${ROLES_ROUTE}/${id}`,
  },
  amenity: {
    list: AMENITIES_ROUTE,
    create: AMENITIES_ROUTE,
    details: (id) => `${AMENITIES_ROUTE}/${id}`,
  },
  propertytype: {
    list: PROPERTY_TYPE_ROUTE,
    create: PROPERTY_TYPE_ROUTE,
    details: (id) => `${PROPERTY_TYPE_ROUTE}/${id}`,
  },
  parkingtype: {
    list: PARKING_TYPE_ROUTE,
  },
  council: {
    list: COUNCIL_TAX_BAND,
  },
  finance: {
    list: FINANCE,
  },
  propretyStatus: {
    list: PROPERTY_STATUS,
  },
  users: {
    list: USER_ROUTE,
    create: USER_ROUTE,
    details: (id) => `${USER_ROUTE}/${id}`,
  },
  clients: {
    list: CLIENTS_ROUTE,
    create: CLIENTS_ROUTE,
    details: (id) => `${CLIENTS_ROUTE}/${id}`,
  },
  leads: {
    list: LEADS_ROUTE,
    create: LEADS_ROUTE,
    details: (id) => `${LEADS_ROUTE}/${id}`,
    match: (id) => `${LEADS_ROUTE}/findproperty/${id}`,
    select: (id) => `${LEADS_ROUTE}/matchproperty/${id}`,
  },
  propertypage: {
    list: PROPERTIES_ROUTE,
    create: PROPERTIES_ROUTE,
    details: (id) => `${PROPERTIES_ROUTE}/${id}`,
  },
};
