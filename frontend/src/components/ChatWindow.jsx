// Libraries
import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import httpRequest from '../utils/apiServices';

// Contexts
import { AuthContext } from '../contexts/AuthContext';

// Components
import MessageWindow from './MessageWindow';
import Message from './Message';

export default function ChatWindow() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Reference to the container element, to auto scroll to bottom of chat
  const messageContainerRef = useRef(null);

  const { currentUser } = useContext(AuthContext);

  // state variable for message list
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);

  // Fetch chat info on mount
  const fetchChat = async () => {
    try {
      const response = await httpRequest('GET', `/api/chats/${id}`);
      setChat(response.data.chat);
    } catch (error) {
      console.log(
        '🚀 ~ file: ChatWindow.jsx:37 ~ fetchMessages ~ error:',
        error
      );
    }
  };

  // Fetch messages on mount
  const fetchMessages = async () => {
    try {
      const response = await httpRequest('GET', `/api/messages/?chatId=${id}`);
      setMessages(response.data.messages_list);
    } catch (error) {
      console.log('🚀 ~ file: ChatWindow.jsx:10 ~ fetchData ~ error:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchChat();
      await fetchMessages();
    };

    fetchData();
  }, []);

  const messageList = messages.map((message) => (
    <Message key={message._id} message={message} groupChat={chat.groupChat} />
  ));

  // Scroll to the bottom of the chat window
  // Triggers on messageList in case of new messages
  useEffect(() => {
    if (messageContainerRef.current) {
      // Scroll to the bottom of the message container
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messageList]);

  // Decide the name of the chat, depending on 1-on-1 or group chat
  const displayChatName = () => {
    if (chat) {
      if (chat.groupChat) {
        // For group chats, display "Chat with" and names of buddies (excluding currentUser)
        const otherBuddies = chat.buddies.filter(
          (buddy) => buddy._id !== currentUser._id
        );
        const names = otherBuddies.map((buddy) => buddy.first_name).join(', ');
        return `Chat with ${names}`;
      } else {
        // For one-on-one chats, display the name of the other user (buddy)
        const otherBuddy = chat.buddies.find((buddy) => {
          return buddy._id !== currentUser._id;
        });
        return otherBuddy.name;
      }
    } else {
      return '';
    }
  };

  const handleClick =() => {
    navigate('/chats')
  }

  // Pass into MessageWindow, called when a new message is sent
  // this forces re-render of the ChatWindow
  const handleSendMessage = async () => {
    // Call fetchData to re-fetch the messages after a new message is sent
    await fetchMessages();
  };

  return (
    <div style={{ height: `calc(100vh - 5rem)` }}>
      <div className='flex'>
        <button className='btn' onClick={handleClick}>⬅</button>
        <h1 className="m-2 p-2">{displayChatName()}</h1>
      </div>
      <div className="flex flex-col" style={{ height: '100%' }}>
        <div ref={messageContainerRef} className="overflow-y-auto flex-1 p-2">
          {messageList}
        </div>
        <div className="h-2rem">
          <MessageWindow onSendMessage={handleSendMessage} chatId={id} />
        </div>
      </div>
    </div>
  );
}
