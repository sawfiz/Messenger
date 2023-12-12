import React, { useState, useContext } from 'react';

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
    console.log(
      '🚀 ~ file: MessageWindow.jsx:30 ~ handleSubmit ~ updatedFormData:',
      updatedFormData
    );
    const response = await httpRequest(
      'POST',
      '/api/messages',
      updatedFormData
    );
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
        sender: currentUser._id,
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
