import React, { useContext } from 'react';

import UserForm from './UserForm';

export default function Profile() {
  return (
    <div>
      <UserForm action={'Update'}  />
    </div>
  );
}
