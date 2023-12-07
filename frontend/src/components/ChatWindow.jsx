import React, { useEffect, useState } from 'react';
import httpRequest from '../utils/apiServices';

export default function ChatWindow() {
  const [data, setData] = useState([]);

  useEffect(() => {
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

    fetchData();
  }, []);

  const messageList = data.map((message) => (
    <div key={message._id}>{message.text}</div>
  ));

  return <div className="w-full h-40">{messageList}</div>;
}
