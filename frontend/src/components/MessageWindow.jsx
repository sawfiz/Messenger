import React, { useState, useContext } from 'react';

import httpRequest from '../utils/apiServices';

// Styling
import { Button, Form, InputGroup } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';

export default function MessageWindow({ onSendMessage, chatId }) {
  const { currentUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    senderId: currentUser._id,
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
    // Add a timestamp to formData
    const updatedFormData = { ...formData, data: new Date() };
    const response = await httpRequest('POST', '/api/messages', updatedFormData);
    if (response.error) {
      console.log(
        '🚀 ~ file: MessageWindow.jsx:21 ~ handleSubmit ~ response.error:',
        response.error
      );
    } else {
      // Handle success, reset form, or navigate to a different page
      console.log('Message sent successfully:', response);
      onSendMessage();
      setFormData({
        senderId: currentUser._id,
        chatId: chatId,
      });
      setFormData((prev) => ({ ...prev, text: '' }));
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
