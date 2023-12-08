// Libraries
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import httpRequest from '../utils/apiServices';

import MessageWindow from './MessageWindow';
import Message from './Message';

export default function ChatWindow() {
  const { id } = useParams();

  // Passing in chat from a navigate
  const location = useLocation();
  const chat = location.state && location.state.chatObject;

  const messageContainerRef = useRef(null);

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await httpRequest(
        'GET',
        `/api/messages/?chatId=${chat._id}`
      );
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
    <Message key={message._id} message={message} />
  ));

  useEffect(() => {
    if (messageContainerRef.current) {
      // Scroll to the bottom of the message container
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messageList]);

  // Pass into MessageWindow, called when a new message is sent
  const handleSendMessage = async () => {
    // Call fetchData to re-fetch the messages after a new message is sent
    await fetchData();
  };

  return (
    <div style={{ height: `calc(100vh - 5rem)` }}>
      <h1 className="m-2 p-2">{chat.name}</h1>
      <div className="flex flex-col" style={{ height: '100%' }}>
        <div ref={messageContainerRef} className="overflow-y-auto flex-1 p-2">
          {messageList}
        </div>
        <div className="h-2rem">
          <MessageWindow onSendMessage={handleSendMessage} chatId={chat._id} />
        </div>
      </div>
    </div>
  );
}
