const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// ROUTES
export const LOGIN_ROUTE = `${apiUrl}/auth/login`;
export const AUTH_ROUTE = `${apiUrl}/auth/verify-token`;
export const CHANGE_PASSWORD = `${apiUrl}/users/changepassword`;

// RAW MASTER ENDPOINT
export const ROLES_ROUTE = `${apiUrl}/roles`;
export const AMENITIES_ROUTE = `${apiUrl}/amenities`;
export const PROPERTY_TYPE_ROUTE = `${apiUrl}/propertytype`;
export const PARKING_TYPE_ROUTE = `${apiUrl}/parkingtype`;
export const COUNCIL_TAX_BAND = `${apiUrl}/counciltaxband`;
export const PROPERTY_STATUS = `${apiUrl}/propertystatus`;
export const FINANCE = `${apiUrl}/leads/finance`;

// USER ROUTE
export const USER_ROUTE = `${apiUrl}/users`;

// CLIENTS MODULE
export const CLIENTS_ROUTE = `${apiUrl}/clients`;

// LEAD MODULE
export const LEADS_ROUTE = `${apiUrl}/leads`;

// POWER REPORT MODULE
export const REPORT_ROUTE = `${apiUrl}/leads/archive`;

// PROPERTY MASTER
export const PROPERTIES_ROUTE = `${apiUrl}/properties`;

// OPPORTUNITY MASTER
export const OPPORTUNITY_ROUTE = `${apiUrl}/opportunity`;

// Followup MASTER
export const FOLLOWUP_ROUTE = `${apiUrl}/followup`;

//Sales 
export const SALES_ROUTE = `${apiUrl}/salesprogression`

//calender
export const CALENDAR_ROUTE = `${apiUrl}/calender`

// Country
export const COUNTRY_ROUTE = `${apiUrl}/country`;

// State
export const STATE_ROUTE = `${apiUrl}/state`;

// City
export const CITY_ROUTE = `${apiUrl}/cities`;
