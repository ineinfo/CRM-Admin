import { useMemo } from 'react';
import { _mock } from 'src/_mock';
import { useAuthContext } from 'src/auth/hooks';

// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

// CHANGE:
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// const { user } = useMockedUser();

// TO:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------

export function useMockedUser() {
  const User = useAuthContext();
  const data = User.user;

  // Memoize the user data fetched from useAuthContext
  const user = useMemo(() => {
    if (data) {
      return {
        id: data.id || '8864c717-587d-472a-929a-8e5f298024da-0',
        displayName: data.first_name || 'Jaydon Frankie',
        email: data.email || 'Sovereign',
        password: data.password || 'demo1234',
        photoURL: data.photoURL || _mock.image.avatar(24),
        phoneNumber: data.phoneNumber || '+40 777666555',
        country: data.country || 'United States',
        address: data.address || '90210 Broadway Blvd',
        state: data.state || 'California',
        city: data.city || 'San Francisco',
        zipCode: data.zipCode || '94116',
        about:
          data.about ||
          'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
        role: data.role || 'admin',
        isPublic: data.isPublic || true,
      };
    }
    return null; // Or some default data
  }, [data]);

  console.log('Memoized user data:', user);

  return { user };
}
