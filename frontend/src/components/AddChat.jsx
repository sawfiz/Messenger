import React, { useState } from 'react';
import DynamicList from './DynamicList';
import httpRequest from '../utils/apiServices';

export default function AddChat() {
  const [buddies, setBuddies] = useState([]);

  const addBuddy = (id) => {
    setBuddies([...buddies, id]);
  };

  const removeBuddy = (id) => {
    const filteredList = buddies.filter((buddyId) => buddyId !== id);
    setBuddies(filteredList);
  };

  return (
    <div>
      <div className="my-2 mx-4 h-8 flex justify-between items-center ">
        <h1 className="my-auto">New chat</h1>
      </div>
      <div className='mx-4'>
        <DynamicList
          fetchDataFunction={() => httpRequest('GET', '/api/users')}
          dataKey="users"
          list={buddies}
          addItem={addBuddy}
          removeItem={removeBuddy}
          showCheckboxes={true}
          showFilter={true}
        />
      </div>
    </div>
  );
}
