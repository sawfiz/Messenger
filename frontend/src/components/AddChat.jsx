import React, { useState, useContext } from 'react';
import DynamicList from './DynamicList';
import httpRequest from '../utils/apiServices';
import { AuthContext } from '../contexts/AuthContext';

export default function AddChat() {
  const {userId} = useContext(AuthContext)
  // By default add the current user to the buddies
  const [buddies, setBuddies] = useState([userId]);

  const addBuddy = (id) => {
    setBuddies([...buddies, id]);
  };

  const removeBuddy = (id) => {
    const filteredList = buddies.filter((buddyId) => buddyId !== id);
    setBuddies(filteredList);
  };

  const handleClick = async () => {
    console.log(buddies);
    const response = await httpRequest('POST', '/api/chats', buddies)
    console.log("🚀 ~ file: AddChat.jsx:20 ~ handleClick ~ response:", response)
  }

  return (
    <div>
      <div className="my-2 mx-4 h-8 flex justify-between items-center ">
        <h1 className="my-auto">New chat</h1>
      </div>
      <div className="mx-4">
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
      <div className='m-4 flex justify-center'>
        <button className="btn btn-primary w-20" onClick={handleClick}>OK</button>
      </div>
    </div>
  );
}
