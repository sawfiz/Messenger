// Libraries
import { useState, useContext, useEffect } from 'react';

import axiosPublic from '../utils/axiosPublic';

// Contexts
import { AuthContext } from '../contexts/AuthContext';
import { LayoutContext } from '../contexts/LayoutContext';
import { useNavigate } from 'react-router-dom';
import { useModal, InfoModal } from '../contexts/ModalContext';

// Components

// Styling
import { Form, Row, Col, Button } from 'react-bootstrap';

export default function Home() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { setShowHeader } = useContext(LayoutContext);
  const { showModal, closeModal } = useModal();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    setShowHeader(false); // Set the header to show when Home component loads
    return () => {
      setShowHeader(true); // Set the header to hide when navigating away from Home
    };
  }, [setShowHeader]); // SetShowHeader is used as a dependency to ensure useEffect runs on its change

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPublic.post('/login', formData);

      // Store logged in user as the currentUser in the AuthContext so it can be used in other components
      const currentUser = response.data.user;
      login(currentUser);
      // Save the JWT token in localStorage for use by http requests elsewhere
      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/chats');
    } catch (error) {
      console.log('🚀 ~ file: Home.jsx:53 ~ error:', error);
      displayErrorModal(error)
    }
  };

    // Display error modal
    const displayErrorModal = (error) => {
      // Display the model. If error is token timed out, click on button logs the user out.
      showModal(
        <InfoModal
          show={true}
          handleClose={closeModal}
          title={error.name}
          body={error.message}
          primaryAction={closeModal}
        />
      );
    };

  return (
    <div
      className="flex items-center justify-center"
      style={{
        height: 'calc(100vh - 1.25rem)',
        backgroundImage: 'url("../src/assets/images/chat-time.webp")',
        backgroundSize: '250px 250px',
        backgroundPosition: 'center',
        // background: 'radial-gradient(circle, #ffffff 0%, #020222 100%)',
        // background: 'linear-gradient(to bottom, #ffffff, #f20202)',
      }}
    >
      <div
        className="rounded-lg bg-white shadow-custom"
        style={{ maxWidth: '300px', width: '100%' }}
      >
        <h2 className="text-center mb-4 p-2 bg-slate-700 text-white rounded-t-lg">
          Messenger
        </h2>
        <Form onSubmit={handleSubmit} className="px-4">
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
          Don&apos;t have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
