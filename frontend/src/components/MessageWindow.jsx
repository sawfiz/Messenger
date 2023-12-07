import React, { useState } from 'react';

import httpRequest from '../utils/apiServices';

// Styling
import { Button, Form, InputGroup } from 'react-bootstrap';

export default function MessageWindow({ onSendMessage }) {
  const [formData, setFormData] = useState({ text: '', date: null });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await httpRequest('POST', '/api/messages', formData);
    if (response.error) {
      console.log(
        '🚀 ~ file: MessageWindow.jsx:21 ~ handleSubmit ~ response.error:',
        response.error
      );
    } else {
      // Handle success, reset form, or navigate to a different page
      console.log('Message sent successfully:', response);
      onSendMessage();
      setFormData({ text: '', date: null });
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
