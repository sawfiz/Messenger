// Libraries
import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import httpRequest from '../utils/apiServices';

// Vite handles .env differently from create-react-app
const BASE_URL = import.meta.env.VITE_BASE_URL; // Set the base URL

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
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);

  const [chatName, setChatName] = useState('');
  const [chatAvatar, setChatAvatar] = useState('/images/unknown.png');

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
      setLoading(false);
    };

    fetchData();
  }, []);

  // set display names after loading is done
  useEffect(() => {
    if (loading === false) setChatTitle();
  }, [loading]);

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
  const setChatTitle = () => {
    if (chat.groupChat) {
      if (chat.customName) {
        setChatName(chat.name);
      } else {
        // For group chats, display "Chat with" and names of buddies (excluding currentUser)
        const otherBuddies = chat.buddies.filter(
          (buddy) => buddy._id !== currentUser._id
        );
        const names = otherBuddies.map((buddy) => buddy.first_name).join(', ');
        setChatName(`Chat with ${names}`);
      }
    } else {
      // For one-on-one chats, display the name of the other user (buddy)
      const otherBuddy = chat.buddies.find(
        (buddy) => buddy._id !== currentUser._id
      );
      setChatName(otherBuddy ? otherBuddy.name : ''); // Return the name if found, otherwise an empty string
      setChatAvatar(otherBuddy.photoUrl ? `${BASE_URL}/${otherBuddy.photoUrl.substring(7)}` : '/images/unknown.png' );
    }
  };

  const handleClick = () => {
    navigate('/chats');
  };

  // Pass into MessageWindow, called when a new message is sent
  // this forces re-render of the ChatWindow
  const handleSendMessage = async () => {
    // Call fetchData to re-fetch the messages after a new message is sent
    await fetchMessages();
  };

  return (
    <>
      {loading ? (
        <p>Loading</p>
      ) : (
        <main>
          <div className="flex items-end">
            <button className="btn" onClick={handleClick}>
              ⬅
            </button>
            <div className="w-12">
              <img
                className="w-10 h-10 object-cover object-center rounded-lg"
                src={chatAvatar}
                alt="groupc chat"
              />
            </div>
            <h3 >{chatName}</h3>
          </div>
          <div
            className="flex flex-col"
            style={{ height: 'calc(100vh - 130px' }}
          >
            <div
              ref={messageContainerRef}
              className="overflow-y-auto flex-1 p-2"
            >
              {messageList}
            </div>
            <div className="h-2rem">
              <MessageWindow onSendMessage={handleSendMessage} chatId={id} />
            </div>
          </div>
        </main>
      )}
    </>
  );
}
