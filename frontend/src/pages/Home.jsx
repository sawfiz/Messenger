// Libraries
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import httpRequest  from '../utils/apiServices';

// Contexts
import { AuthContext } from '../contexts/AuthContext';
import { useModal, InfoModal } from '../contexts/ModalContext';
import { useNavigate } from 'react-router-dom';

// Components
// import Login from '../components/user/Login';

// Styling
import { Form, Row, Col, Button } from 'react-bootstrap';

export default function Home() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { showModal, closeModal } = useModal();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const response = await httpRequest('POST', '/login', formData );
    setLoading(false)

    if (response.error) {
      // Handle error and show modal
      showModal(
        <InfoModal
          show={true}
          handleClose={closeModal}
          title={response.error}
          body={response.message}
          primaryAction={closeModal}
        />
      );
    } else {
      // Set response and the user's name in the AuthContext
      const name = response.data.user.name;
      login(name);
      // Save the JWT token in localStorage
      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/chat');
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("../src/assets/images/chat-time.webp")',
        backgroundSize: '250px 250px',
        backgroundPosition: 'center',
        // background: 'radial-gradient(circle, #ffffff 0%, #020222 100%)',
        // background: 'linear-gradient(to bottom, #ffffff, #f20202)',
      }}
    >
      <div
        className="p-4 rounded bg-white shadow"
        style={{ maxWidth: '300px', width: '100%' }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} controlId="formUsername">
            <Form.Label column sm="4">
              Username:
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <div className="h-2"></div>

          <Form.Group as={Row} controlId="formPassword">
            <Form.Label column sm="4">
              Password:
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 mt-2">
            Login
          </Button>
        </Form>
        <hr></hr>

        <p className="text-center mt-3">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
