import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicList from './DynamicList';
import httpRequest from '../utils/apiServices';
import { AuthContext } from '../contexts/AuthContext';

import { Form, InputGroup } from 'react-bootstrap';

export default function AddChat() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  // By default add the current user to the buddies
  const [formData, setFormData] = useState({
    name: '',
    buddies: [currentUser],
    groupChat: false,

  });

  const addBuddy = (user) => {
    setFormData((prevData) => ({
      ...prevData,
      buddies: [...prevData.buddies, user],
    }));
  };

  const removeBuddy = (user) => {
    setFormData((prevData) => ({
      ...prevData,
      buddies: prevData.buddies.filter((buddy) => buddy.id !== user.id),
    }));
  };

  const updateFormDataName = () => {
    // If only 2 people in chat, chat name is the other person's name
    if (formData.buddies.length === 2) {
      setFormData((prevData) => ({
        ...prevData,
        name: formData.buddies[1].name,
        groupChat: false,
      }));
    } else if (formData.buddies.length > 2) {
      const firstNames = formData.buddies
        .slice(1)
        .map((buddy) => buddy.first_name);
      // .map((buddy) => buddy.name.split(' ')[0]); // Extracting first names except the first buddy
      const groupName = `Chat with ${firstNames.join(', ')}`;
      setFormData((prevData) => ({
        ...prevData,
        name: groupName,
        groupChat: true,
      }));
    }
  };

  useEffect(() => {
    updateFormDataName();
  }, [formData.buddies]); // Trigger the update when buddies array changes

  const handleClick = async () => {
    console.log(formData);
    try {
      const response = await httpRequest('POST', '/api/chats', formData);
      console.log(
        '🚀 ~ file: AddChat.jsx:64 ~ handleClick ~ response:',
        response
      );
      const chat = response.data.message;
      const chatId = chat._id;
      navigate(`/chat/${chatId}` )
    } catch (error) {
      console.log('🚀 ~ file: AddChat.jsx:63 ~ handleClick ~ error:', error);
    }
  };

  return (
    <main>
      <div className="my-2 mx-4 h-8 flex justify-between items-center ">
        {/* Conditionally render group chat name input */}
        {formData.groupChat ? (
          <div className="w-full">
            <InputGroup>
              <InputGroup.Text>Group Chat</InputGroup.Text>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    name: e.target.value,
                  }))
                }
              />
            </InputGroup>
          </div>
        ) : (
          <h1 className="my-auto">New chat</h1>
        )}
      </div>

      <div className="mx-4">
        <DynamicList
          fetchDataFunction={() => httpRequest('GET', '/api/users')}
          dataKey="users"
          list={formData.buddies}
          addItem={addBuddy}
          removeItem={removeBuddy}
          showCheckboxes={true}
          showFilter={true}
        />
      </div>

      <div className="m-4 flex justify-center">
        <button className="btn btn-primary w-20" onClick={handleClick}>
          OK
        </button>
      </div>
    </main>
  );
}
