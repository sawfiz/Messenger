import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';
// Vite handles .env differently from create-react-app
const BASE_URL = import.meta.env.VITE_BASE_URL; // Set the base URL

export default function ChatItem({ chat }) {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [chatName, setChatName] = useState('');
  const [chatAvatar, setChatAvatar] = useState('/images/unknown.png');

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
      setChatAvatar('/images/groupchat.png' );
    } else {
      // For one-on-one chats, display the name of the other user (buddy)
      const otherBuddy = chat.buddies.find(
        (buddy) => buddy._id !== currentUser._id
      );
      setChatName(otherBuddy.name);
      setChatAvatar(otherBuddy.photoUrl ? `${BASE_URL}/${otherBuddy.photoUrl.substring(7)}` : '/images/unknown.png' );
    }
  };

  useEffect(() => {
    displayChatName();
  }, []);

  return (
    <div className="my-2">
      <Card onClick={handleClick}>
        {chat && chat.name && (
          <Card.Body className="flex">
            <div className="w-12">
              <img
                className="w-10 h-10 object-cover object-center rounded-lg"
                src={chatAvatar}
                alt="groupc chat"
              />
            </div>
            <div >{chatName}</div>
          </Card.Body>
        )}
      </Card>
    </div>
  );
}
