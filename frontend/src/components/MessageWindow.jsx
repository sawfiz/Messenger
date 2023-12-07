import React, { useState } from 'react';

import httpRequest from '../utils/apiServices'

// Styling
import { Button, Form, InputGroup } from 'react-bootstrap';

export default function MessageWindow() {
  const [formData, setFormData] = useState({ message: '', date: null });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await httpRequest('POST', '/api/messages', formData)
    if (response.error) {
    console.log("🚀 ~ file: MessageWindow.jsx:21 ~ handleSubmit ~ response.error:", response.error)

    } else {
      // Handle success, reset form, or navigate to a different page
      console.log('Message sent successfully:', response);
    }
  };
  return (
    <div>
      <div className="p-2">
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Message..."
              value={FormData.message}
              onChange={handleChange}
              autoFocus
            />
            <button className='btn btn-primary' type="submit">
              Send
            </button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
}
