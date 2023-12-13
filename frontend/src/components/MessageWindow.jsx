import { useState, useContext } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

import httpRequest from '../utils/apiServices';

// Styling
import { Button, Form, InputGroup } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';

export default function MessageWindow({ onSendMessage, chatId }) {
  const { currentUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    chatId: chatId,
    text: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.text) return;

    // Add a timestamp to formData
    const updatedFormData = {
      ...formData,
      sender: currentUser._id,
      date: new Date(),
    };

    try {
      const response = await httpRequest(
        'POST',
        '/api/messages',
        updatedFormData
      );

      console.log('Message sent successfully:', response);

      const response2 = await httpRequest('PATCH', `/api/chats/${chatId}`, {latest: new Date()})

      onSendMessage();
      setFormData({
        sender: currentUser._id,
        chatId: chatId,
      });
      setFormData((prev) => ({ ...prev, text: '' }));
    } catch (error) {
      console.log(
        '🚀 ~ file: MessageWindow.jsx:56 ~ handleSubmit ~ error:',
        error
      );
    }
  };

  return (
    <div>
      <div className="p-2">
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Form.Control
              type="text"
              name="text"
              placeholder="Message..."
              value={formData.text}
              onChange={handleChange}
              autoFocus
            />
            <Button type="submit">Send</Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
}

// Prop Types validation
MessageWindow.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  chatId: PropTypes.string.isRequired,
};