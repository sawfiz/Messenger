import { useContext } from 'react';
import format from 'date-fns/format';
import isToday from 'date-fns/isToday';
import PropTypes from 'prop-types'; // Import PropTypes

import { AuthContext } from '../contexts/AuthContext';

export default function Message({ message, groupChat }) {
  const { currentUser } = useContext(AuthContext);

  const formatDate = () => {
    const date = new Date(message.date);

    if (isToday(date)) {
      return format(date, 'hh:mm a');
    } else {
      return format(date, 'MM-dd hh:mm a');
    }
  };

  return (
    <div className="message-container">
      {message.sender._id === currentUser._id ? (
        <div className="message-bubble-send">
          <div className='flex justify-end'>
          <p className="message-date">{formatDate()}</p>
          </div>
          <p className="message-content">{message.text}</p>
        </div>
      ) : (
        <div className="message-bubble-received">
          <div className='flex justify-between'>
            {groupChat ? (
              <p className="message-name">{message.sender.name}</p>
            ) : <p/>}
            <p className="message-date">{formatDate()}</p>
          </div>
          <p className="message-content">{message.text}</p>
        </div>
      )}
    </div>
  );
}

// Prop Types validation
Message.propTypes = {
  message: PropTypes.shape({
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    sender: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }),
    text: PropTypes.string.isRequired
  }).isRequired,
  groupChat: PropTypes.bool.isRequired
};