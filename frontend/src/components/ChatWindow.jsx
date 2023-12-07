import React, { useEffect, useState } from 'react';
import httpRequest from '../utils/apiServices';

import MessageWindow from './MessageWindow';

export default function ChatWindow() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await httpRequest('GET', '/api/messages');
      console.log(
        '🚀 ~ file: ChatWindow.jsx:10 ~ fetchData ~ response:',
        response
      );
      setData(response.data.messages_list);
    } catch (error) {
      console.log('🚀 ~ file: ChatWindow.jsx:10 ~ fetchData ~ error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const messageList = data.map((message) => (
    <div key={message._id}>{message.text}</div>
  ));

  // Pass into MessageWindow, called when a new message is sent
  const handleSendMessage = async () => {
    // Call fetchData to re-fetch the messages after a new message is sent
    await fetchData();
  };

  return (
    <div className='flex flex-col h-screen'>
      <div className="overflow-y-auto flex-1 p-2">{messageList}</div>
      <div className='h-2rem'>
        <MessageWindow onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
