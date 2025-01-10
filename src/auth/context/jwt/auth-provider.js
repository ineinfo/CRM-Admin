'use client';

import PropTypes from 'prop-types';
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';
import { AUTH_ROUTE, CHANGE_PASSWORD, LOGIN_ROUTE } from 'src/utils/apiendpoints';

import { AuthContext } from './auth-context'; // Ensure AuthContext is imported correctly
import { setSession, isValidToken } from './utils';
import { UsegetRoles } from 'src/api/roles';

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: false,
};

const reducer = (state, action) => {
  console.log('Reducer action:', action); // Add logging to track actions
  switch (action.type) {
    case 'INITIAL':
      return {
        user: action.payload.user,
        loading: false,
      };
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        loading: false, // Ensure loading is set to false on login
      };
    case 'REGISTER':
      return {
        ...state,
        user: action.payload.user,
        loading: false, // Ensure loading is set to false on register
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        loading: false, // Ensure loading is set to false on logout
      };
    default:
      return state;
  }
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { products: roles } = UsegetRoles();

  const initialize = useCallback(async () => {
    try {
      const storedData = sessionStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const { accessToken, user } = JSON.parse(storedData);
        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          const response = await axios.get(AUTH_ROUTE);
          const userData = response.data;

          const role_id = userData?.data?.role_id;
          console.log("Role ID:", role_id);
          console.log("Roles:", roles);

          if (roles && roles.length > 0) {
            const matchedRoleName = roles.find((role) => role.id === role_id)?.role_name;
            console.log("Nikhil25", matchedRoleName);

            const canEdit =
              matchedRoleName === "Administrator " || matchedRoleName === "Admin"
                ? userData.isEditable ? userData.isEditable : true
                : false;
            console.log("Nikhil1111111", canEdit);

            dispatch({
              type: 'INITIAL',
              payload: {
                user: {
                  ...userData,
                  accessToken,
                  editable: canEdit,
                },
              },
            });
          } else {
            dispatch({
              type: 'INITIAL',
              payload: { user: null },
            });
          }
        } else {
          dispatch({
            type: 'INITIAL',
            payload: { user: null },
          });
        }
      } else {
        dispatch({
          type: 'INITIAL',
          payload: { user: null },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: { user: null },
      });
    }
  }, [roles]);

  useEffect(() => {
    if (roles && roles.length > 0) {
      initialize();
    }
  }, [roles, initialize]);

  // LOGIN
  const login = useCallback(async (email, password) => {
    try {
      const data = { email, password };
      const response = await axios.post(LOGIN_ROUTE, data);
      const { accessToken, user } = response.data;
      console.log("Login successful:", user);

      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ accessToken, user })
      );
      const role_id = user?.role_id

      const matchedRoleName = roles?.find((role) => role.id === role_id)?.role_name;

      const canEdit =
        matchedRoleName === "Administrator " || matchedRoleName === "Admin"
          ? user.isEditable ? user.isEditable : true
          : false;
      console.log("Nikhil11111112", canEdit);

      setSession(accessToken);
      dispatch({
        type: 'LOGIN',
        payload: {
          user: {
            ...user,
            accessToken,
            editable: canEdit
          },
        },
      });

      // Return the user data for further checks
      return { user };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [roles]);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const data = {
      email,
      password,
      firstName,
      lastName,
    };

    const response = await axios.post(endpoints.auth.register, data);

    const { accessToken, user } = response.data;

    sessionStorage.setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user: {
          ...user,
          accessToken,
        },
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    sessionStorage.removeItem(STORAGE_KEY);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // CHANGE PASSWORD
  const changePassword = useCallback(
    async (token, current_password, new_password, confirm_password) => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Sending the token in Bearer format
          },
        };

        const data = {
          current_password,
          new_password,
          confirm_password,
        };

        await axios.post(CHANGE_PASSWORD, data, config); // API call to change password

        // After changing the password, log the user out
        logout();
      } catch (error) {
        console.error('Password change failed:', error);
      }
    },
    [logout]
  );

  // ----------------------------------------------------------------------
  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;
  console.log("Nikhil", state);

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: state.loading, // Use state.loading directly
      authenticated: state.user ? true : false,
      unauthenticated: !state.user,
      //
      login,
      register,
      logout,
      changePassword,
    }),
    [login, logout, changePassword, register, state.user, state.loading]
  );

  console.log("AuthProvider state:", state); // Add logging to track state

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};

// Ensure AuthProvider is wrapping the components that need to use the context
