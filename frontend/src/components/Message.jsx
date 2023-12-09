import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Message({ message, groupChat }) {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="message-container">
      {message.senderId._id === currentUser._id ? (
        <div className="message-bubble-send">
          <p className="message-content">{message.date}</p>
          <p className="message-content">{message.text}</p>
        </div>
      ) : (
        <div className="message-bubble-received">
          {groupChat && <p className="message-content">{message.senderId.name}</p>}
          <p className="message-content">{message.date}</p>
          <p className="message-content">{message.text}</p>
        </div>
      )}
    </div>
  );
}
