import React from 'react';
import UserEditForm from 'src/layouts/common/edit-profile';

export const metadata = {
  title: 'Edit Profile',
};

function page() {
  return (
    <div>
      <UserEditForm metadata={metadata} />
    </div>
  );
}

export default page;
