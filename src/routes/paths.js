import { paramCase } from 'src/utils/change-case';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneUI: 'https://mui.com/store/items/zone-landing-page/',
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma:
    'https://www.figma.com/file/hjxMnGUJCjY7pX8lQbS7kn/%5BPreview%5D-Minimal-Web.v5.4.0?type=design&node-id=0-1&mode=design&t=2fxnS70DuiTLGzND-0',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id) => `/product/${id}`,
    demo: {
      details: `/product/${MOCK_ID}`,
    },
  },
  post: {
    root: `/post`,
    details: (title) => `/post/${paramCase(title)}`,
    demo: {
      details: `/post/${paramCase(MOCK_TITLE)}`,
    },
  },
  // AUTH
  auth: {
    amplify: {
      login: `${ROOTS.AUTH}/amplify/login`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      register: `${ROOTS.AUTH}/amplify/register`,
      newPassword: `${ROOTS.AUTH}/amplify/new-password`,
      forgotPassword: `${ROOTS.AUTH}/amplify/forgot-password`,
    },
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
    firebase: {
      login: `${ROOTS.AUTH}/firebase/login`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      register: `${ROOTS.AUTH}/firebase/register`,
      forgotPassword: `${ROOTS.AUTH}/firebase/forgot-password`,
    },
    auth0: {
      login: `${ROOTS.AUTH}/auth0/login`,
    },
    supabase: {
      login: `${ROOTS.AUTH}/supabase/login`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      register: `${ROOTS.AUTH}/supabase/register`,
      newPassword: `${ROOTS.AUTH}/supabase/new-password`,
      forgotPassword: `${ROOTS.AUTH}/supabase/forgot-password`,
    },
  },
  authDemo: {
    classic: {
      login: `${ROOTS.AUTH_DEMO}/classic/login`,
      register: `${ROOTS.AUTH_DEMO}/classic/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
    },
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    report: `${ROOTS.DASHBOARD}/power-report`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
    },
    clients: {
      root: `${ROOTS.DASHBOARD}/clients`,
      new: `${ROOTS.DASHBOARD}/clients/new`,
      list: `${ROOTS.DASHBOARD}/clients/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/clients/${id}/edit`,
    },
    leads: {
      root: `${ROOTS.DASHBOARD}/leads`,
      new: `${ROOTS.DASHBOARD}/leads/new`,
      list: `${ROOTS.DASHBOARD}/leads/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/leads/${id}/edit`,
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    roles: {
      root: `${ROOTS.DASHBOARD}/roles`,
      new: `${ROOTS.DASHBOARD}/roles/new`,
      details: (id) => `${ROOTS.DASHBOARD}/roles/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/roles/${id}/edit`,
    },
    amenities: {
      root: `${ROOTS.DASHBOARD}/amenities`,
      new: `${ROOTS.DASHBOARD}/amenities/new`,
      details: (id) => `${ROOTS.DASHBOARD}/amenities/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/amenities/${id}/edit`,
    },
    propertytype: {
      root: `${ROOTS.DASHBOARD}/propertytype`,
      new: `${ROOTS.DASHBOARD}/propertytype/new`,
      details: (id) => `${ROOTS.DASHBOARD}/propertytype/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/propertytype/${id}/edit`,
    },
    propertypage: {
      main: `${ROOTS.DASHBOARD}/developers`,
      root: `${ROOTS.DASHBOARD}/developers/list`,
      new: `${ROOTS.DASHBOARD}/developers/new`,
      details: (id) => `${ROOTS.DASHBOARD}/developers/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/developers/${id}/edit`,
    },

    followup: {
      root: `${ROOTS.DASHBOARD}/followup`,
      new: `${ROOTS.DASHBOARD}/followup/new`,
      details: (id) => `${ROOTS.DASHBOARD}/developers/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/followup/${id}/edit`,
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
    }
  },
};
