import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';

import { Card } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';
import httpRequest from '../utils/apiServices';
// Vite handles .env differently from create-react-app
const BASE_URL = import.meta.env.VITE_BASE_URL; // Set the base URL

export default function ChatItem({ chat }) {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [chatName, setChatName] = useState('');
  const [chatAvatar, setChatAvatar] = useState('/images/unknown.png');

  const [latestMessage, setLatestMessage] = useState(null);
  console.log(
    '🚀 ~ file: ChatItem.jsx:17 ~ ChatItem ~ lastestMessage:',
    latestMessage
  );

  // Get the latest message of this chat
  useEffect(() => {
    const fetchLatestMessage = async () => {
      try {
        console.log('chat.id', chat._id);
        const response = await httpRequest(
          'GET',
          `/api/messages/latest?chatId=${chat._id}`
        );
        console.log(
          '🚀 ~ file: ChatItem.jsx:22 ~ fetchLatestMessage ~ response.data.messages_list:',
          response.data.messages_list
        );
        setLatestMessage(response.data.messages_list[0]);
      } catch (error) {
        console.log(
          '🚀 ~ file: ChatItem.jsx:25 ~ fetchLatestMessage ~ error:',
          error
        );
      }
    };

    fetchLatestMessage();
  }, []);

  const handleClick = () => {
    navigate(`/chat/${chat._id}`);
  };

  const displayChatName = () => {
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
      setChatAvatar(
        chat.photoUrl
          ? `${BASE_URL}/${chat.photoUrl.substring(7)}`
          : '/images/groupchat.png'
      );
    } else {
      // For one-on-one chats, display the name of the other user (buddy)
      const otherBuddy = chat.buddies.find(
        (buddy) => buddy._id !== currentUser._id
      );
      setChatName(otherBuddy.name);
      setChatAvatar(
        otherBuddy.photoUrl
          ? `${BASE_URL}/${otherBuddy.photoUrl.substring(7)}`
          : '/images/unknown.png'
      );
    }
  };

  useEffect(() => {
    displayChatName();
  }, []);

  const lastestMessageEl = () => {
    if (!latestMessage) return '';

    let result = latestMessage.text;

    if (result.length > 50) {
      result = result.substring(0, 25) + '...';
    }

    if (currentUser._id === latestMessage.sender._id) {
      result = `You: ${result}`;
      return result;
    }

    if (chat.groupChat) {
      result = `${latestMessage.sender.first_name}: ${result}`;
    }

    return result;
  };

  const formatDate = (input) => {
    const date = new Date(input);

    if (isToday(date)) {
      return format(date, 'hh:mm a');
    } else {
      return format(date, 'MM-dd hh:mm a');
    }
  };

  return (
    <div className="my-2">
      <Card onClick={handleClick} style={{ maxHeight: '6rem' }}>
        {chat && chat.name && (
          <Card.Body className="flex">
            <div className="w-12">
              <img
                className="w-10 h-10 object-cover object-center rounded-lg"
                src={chatAvatar}
                alt="groupc chat"
              />
            </div>
            <div>
              <div>{chatName}</div>
              <div
                className=" text-slate-400"
                style={{ wordWrap: 'break-word' }}
              >
                {lastestMessageEl()}
              </div>
              <div className="message-date absolute bottom-1 right-2">
                {latestMessage ? formatDate(latestMessage.date) : ''}
              </div>
            </div>
          </Card.Body>
        )}
      </Card>
    </div>
  );
}
