import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';

export default function ChatItem({ chat }) {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const handleClick = () => {
    navigate(`/chat/${chat._id}`);
  };

  const displayChatName = () => {
    if (chat.groupChat) {
      if (chat.customName) {
        return chat.name;
      } else {
        // For group chats, display "Chat with" and names of buddies (excluding currentUser)
        const otherBuddies = chat.buddies.filter(
          (buddy) => buddy._id !== currentUser._id
        );
        const names = otherBuddies.map((buddy) => buddy.first_name).join(', ');
        return `Chat with ${names}`;
      }
    } else {
      // For one-on-one chats, display the name of the other user (buddy)
      const otherBuddy = chat.buddies.find(
        (buddy) => buddy._id !== currentUser._id
      );
      return otherBuddy.name;
    }
  };

  return (
    <div className="my-2">
      <Card onClick={handleClick}>
        {chat && chat.name && <Card.Body>{displayChatName()}</Card.Body>}
      </Card>
    </div>
  );
}
