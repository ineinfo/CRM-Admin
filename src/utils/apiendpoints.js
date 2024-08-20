
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ROUTES
export const LOGIN_ROUTE = `${apiUrl}/auth/login`;
export const AUTH_ROUTE = `${apiUrl}/auth/verify-token`;

// RAW MASTER ENDPOINT
export const ROLES_ROUTE = `${apiUrl}/roles`;
export const AMENITIES_ROUTE = `${apiUrl}/amenities`;
export const PROPERTY_TYPE_ROUTE = `${apiUrl}/propertytype`;


// USER ROUTE
export const USER_ROUTE = `${apiUrl}/users`;

// CLIENTS MODULE 
export const CLIENTS_ROUTE = `${apiUrl}/clients`;

// LEAD MODULE 
export const LEADS_ROUTE = `${apiUrl}/leads`;

// PROPERTY MASTER 
export const PROPERTIES_ROUTE = `${apiUrl}/properties`;