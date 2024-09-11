import React from 'react';
import Profile from '../../../layouts/common/profile';

export const metadata = {
  title: 'Profile',
};

const userData = {
  first_name: 'first user',
  last_name: 'first user',
  mobile_number: '',
  avatarurl: null,
  email: 'user@gmail.com',
  role_id: 1,
  created: '2024-08-06T18:00:23.000Z',
};

function Page() {
  return (
    <div>
      <Profile metadata={metadata} />
    </div>
  );
}

export default Page;
