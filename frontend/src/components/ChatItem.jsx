import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';

export default function ChatItem({ chat }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/chat/${chat._id}`, { state: { chatObject: chat } });
  };

  return (
    <div className='my-2'>
      <Card onClick={handleClick}>
        {chat && chat.name && <Card.Body>{chat.name}</Card.Body>}
      </Card>
    </div>
  );
}
