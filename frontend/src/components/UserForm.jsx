// Libraries
import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Contexts
import { AuthContext } from '../contexts/AuthContext';
import { useModal, InfoModal } from '../contexts/ModalContext';

// Utilities
import httpRequest from '../utils/apiServices';

// Styling
import { Button, Form, Row, Col, InputGroup } from 'react-bootstrap';

const UserForm = ({ action }) => {
  const { id } = useParams();
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
  });

  const [match, setMatch] = useState(true);
  const [validationErrors, setValidationErrors] = useState([]);

  // If an id is provided in the route, GET data of the user
  useEffect(() => {
    const fetchData = async () => {
      const response = await httpRequest(
        'GET',
        `/api/users/${id}`,
        null,
        'user'
      );

      if (response.error) {
        displayErrorModal(response);
      } else {
        setFormData(response.data.user);
      }
    };

    if (id) fetchData();
    setLoading(false);
  }, [id]); // Include id as it is used in the useEffect

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

    let inputValue;
    if (type === 'checkbox') {
      inputValue = checked;
    } else {
      inputValue = value;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: inputValue,
    }));

    if (name === 'password1') {
      setFormData((prevFormData) => ({ ...prevFormData, password: value }));
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
      if (id) {
        updateuser();
      } else {
        createuser();
      }
    }
  };

  const createuser = async () => {
    // Logic for creating a new user
    console.log('Perform POST request:', formData);
    const response = await httpRequest('POST', '/api/users', formData);
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
    const response = await httpRequest('PUT', `/api/users/${id}`, formData);
    if (response.error) {
      handleFormErrors(response);
    } else {
      // Handle success, reset form, or navigate to a different page
      console.log('user updated successfully:', updateuser);
      navigate(`/users/${id}`);
    }
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
    console.log("🚀 ~ file: UserForm.jsx:189 ~ handleCancel ~ action:", action)
    if (action === 'Create') {
      navigate('/');
    }
    console.log("🚀 ~ file: UserForm.jsx:189 ~ handleCancel ~ action:", action)
    navigate(`/users/${id}`);
    // In case of Update, the cancel button is automatically handled
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
        style={{ maxWidth: '360px', width: '100%' }}
      >
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

          {action === 'Create' && (
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
          )}
          {action === 'Update' && (
            <div>
              <div className="flex justify-between w-80 items-center mb-2">
                <div>
                  <label>Role</label>
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="p-1 ml-4 w-20"
                >
                  <option value="">-</option>
                  <option value="visitor">Visitor</option>
                  <option value="parent">Parent</option>
                  <option value="coach">Coach</option>
                </select>
              </div>
            </div>
          )}
          <div className="flex justify-around mt-4">
            <Button variant="secondary" type="cancel" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">{action}</Button>
          </div>
        </Form>
      </div>
      {loading && <p>Submitting...</p>}
    </div>
  );
};

export default UserForm;
