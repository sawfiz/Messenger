// Libraries
import { useState, useEffect, useContext } from 'react';
import {  useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'; // Import PropTypes

// Contexts
import { AuthContext } from '../contexts/AuthContext';
import { useModal, InfoModal } from '../contexts/ModalContext';

// Utilities
import httpRequest from '../utils/apiServices';

// Styling
import { Button, Form, Row, Col, InputGroup } from 'react-bootstrap';

const UserForm = ({ action }) => {
  const { currentUser } = useContext(AuthContext);
  console.log('🚀 ~ file: UserForm.jsx:17 ~ currentUser:', currentUser);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { showModal, closeModal } = useModal();

  // State variables
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    password1: '',
    password2: '',
    avatar: null,
  });

  const [match, setMatch] = useState(true);
  const [validationErrors, setValidationErrors] = useState([]);

  // If an id is provided in the route, GET data of the user
  useEffect(() => {
    setFormData(currentUser);
    setLoading(false);
  }, []); // Include id as it is used in the useEffect

  // Display error modal
  const displayErrorModal = (response) => {
    // Display the model. If error is token timed out, click on button logs the user out.
    showModal(
      <InfoModal
        show={true}
        handleClose={closeModal}
        title={response.error}
        body={response.message}
        primaryAction={response.status === 403 ? handleLogout : closeModal}
      />
    );
  };

  // Logout if token expired
  const handleLogout = async () => {
    await httpRequest('POST', '/logout');
    closeModal();
    logout();
    navigate('/login');
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === 'file') {
      const file = event.target.files[0];
      setFormData((prevFormData) => ({
        ...prevFormData,
        avatar: file, // Save the selected file to state
      }));
    } else {
      const inputValue = type === 'checkbox' ? checked : value;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: inputValue,
      }));
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    setLoading(true);

    console.log(
      '🚀 ~ file: Signup.jsx:48 ~ handleSubmit ~ formData:',
      formData
    );
    const { password1, password2 } = formData;
    const passwordMatch = password1 === password2;
    setMatch(passwordMatch);

    if (passwordMatch) {
      if (action === 'Update') {
        updateuser();
      } else {
        createuser();
      }
    }
  };

  const createuser = async () => {
    // Logic for creating a new user
    console.log('Perform POST request:', formData);
    const response = await httpRequest(
      'POST',
      '/api/users',
      convertToFormData()
    );
    if (response.error) {
      handleFormErrors(response);
    } else {
      // Handle success, reset form, or navigate to a different page
      console.log('user created successfully:', response);
      navigate('/');
    }
  };

  const updateuser = async () => {
    // Logic for updating an existing user
    console.log('Perform PUT request:', formData);
    console.log(
      '🚀 ~ file: UserForm.jsx:123 ~ updateuser ~ formData:',
      formData
    );
    const response = await httpRequest(
      'PUT',
      `/api/users/${currentUser._id}`,
      convertToFormData()
    );
    if (response.error) {
      handleFormErrors(response);
    } else {
      // Handle success, reset form, or navigate to a different page
      console.log('user updated successfully:', updateuser);
      navigate(`/chats`);
    }
  };

  const convertToFormData = () => {
    const formDataToSend = new FormData();

    // Append each key-value pair from formData to FormData instance
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    return formDataToSend;
  };

  const handleFormErrors = (response) => {
    console.log(
      '🚀 ~ file: userForm.jsx:130 ~ handleFormErrors ~ response:',
      response
    );
    if (response.status === 400) {
      // Handle backend validation validationErrors
      // const validationErrors = JSON.parse(response).errors.map((err) => ({
      const errors = JSON.parse(response.message);
      console.log(
        '🚀 ~ file: userForm.jsx:135 ~ //validationErrors ~ errors:',
        errors
      );
      const validationErrors = JSON.parse(response.message).errors.map(
        (err) => ({
          path: err.path,
          msg: err.msg,
        })
      );
      setValidationErrors(validationErrors);
    } else {
      // Clear validation errors displayed on page
      setValidationErrors([]);
      // Handle other errors
      displayErrorModal(response);
    }
  };

  // To show backend validation error for an input field
  const showValidationError = (fieldName) => {
    return validationErrors.map((error, index) => {
      if (error.path === fieldName) {
        return (
          <p key={index} style={{ color: 'red' }}>
            {error.msg}
          </p>
        );
      }
      return null;
    });
  };

  const handleCancel = () => {
    if (action === 'Create') {
      navigate('/');
    } else {
      navigate(`/chats`);
    }
  };

  return (
    <>
      <div className="userform p-3 rounded bg-white shadow mt-2">
        <h2 className="mb-4">{action} User</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} controlId="formFirstname">
            <Form.Label column sm="4">
              First name:
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                placeholder="Usain"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>
          {showValidationError('first_name')}
          <Form.Group as={Row} controlId="formLastname">
            <Form.Label column sm="4">
              First name:
            </Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                placeholder="Bolt"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </Col>
          </Form.Group>
          {showValidationError('last_name')}
          <InputGroup className="mb-2">
            <InputGroup.Text>Avatar</InputGroup.Text>
            <Form.Control
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
            />
          </InputGroup>
          <div>
            <hr />
            <Form.Group as={Row} controlId="formUsername">
              <Form.Label column sm="4">
                Username:
              </Form.Label>
              <Col sm="8">
                <Form.Control
                  type="text"
                  placeholder="ubolt"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Form.Group>
            {showValidationError('username')}
            <Form.Group as={Row} controlId="formPassword1">
              <Form.Label column sm="6">
                Password:
              </Form.Label>
              <Col sm="6">
                <Form.Control
                  type="password"
                  name="password1"
                  placeholder="Password"
                  value={formData.password1}
                  required
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>
            {showValidationError('password')}
            <Form.Group as={Row} controlId="formPassword2">
              <Form.Label column sm="6">
                Re-enter Password:
              </Form.Label>
              <Col sm="6">
                <Form.Control
                  type="password"
                  name="password2"
                  placeholder="Password"
                  value={formData.password2}
                  required
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>
            {match ? (
              ''
            ) : (
              <p className="text-danger">Passwords do not match.</p>
            )}
          </div>
          <div className="flex justify-around mt-4">
            <Button variant="secondary" type="cancel" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">{action}</Button>
          </div>
        </Form>
      </div>
      {loading && <p>Submitting...</p>}
    </>
  );
};

// Prop Types validation
UserForm.propTypes = {
  action: PropTypes.oneOf(['Create', 'Update']).isRequired,
};

export default UserForm;
