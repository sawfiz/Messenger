// Library
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicList from './DynamicList';
import httpRequest from '../utils/apiServices';

// Contexts
import { AuthContext } from '../contexts/AuthContext';

// Styling
import { Modal, Button, Form } from 'react-bootstrap';

export default function AddChat() {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const [showModal, setShowModal] = useState(false);

  // By default add the current user to the buddies
  const [formData, setFormData] = useState({
    name: '',
    buddies: [currentUser],
    groupChat: false,
    customName: false,
  });

  const addBuddy = (user) => {
    setFormData((prevData) => ({
      ...prevData,
      buddies: [...prevData.buddies, user],
    }));
  };

  const removeBuddy = (user) => {
    setFormData((prevData) => ({
      ...prevData,
      buddies: prevData.buddies.filter((buddy) => buddy.id !== user.id),
    }));
  };

  const updateFormDataName = () => {
    // If only 2 people in chat, chat name is the other person's name
    if (formData.buddies.length === 2) {
      setFormData((prevData) => ({
        ...prevData,
        name: formData.buddies[1].name,
        groupChat: false,
      }));
    } else if (formData.buddies.length > 2) {
      const firstNames = formData.buddies
        .slice(1)
        .map((buddy) => buddy.first_name);
      // .map((buddy) => buddy.name.split(' ')[0]); // Extracting first names except the first buddy
      const groupName = `Chat with ${firstNames.join(', ')}`;
      setFormData((prevData) => ({
        ...prevData,
        name: groupName,
        groupChat: true,
      }));
    }
  };

  useEffect(() => {
    updateFormDataName();
  }, [formData.buddies]); // Trigger the update when buddies array changes

  const handleCancel = () => {
    navigate('/chats');
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveModal = () => {
    // Handle saving the form data or performing any actions
    console.log('Form data:', formData);
    handleCloseModal();
  };

  const handleChangeGroupName = (e) => {
    console.log(
      '🚀 ~ file: AddChat.jsx:75 ~ handleChangeGroupChatName ~ e:',
      e.target
    );
    setFormData((prevData) => ({
      ...prevData,
      name: e.target.value,
      customName: true,
    }));
  };

  const handleChangeGroupAvatar = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      avatar: file,
      customAvatar: true,
    }));
  };

  const handleSubmit = async () => {
    console.log(formData);
    if (!formData.groupChat) {
      handleSave()
    } else {
      // Show modal for editing group chat name and avatar

      handleShowModal();
    }
  };

  const handleSave = async () => {
    try {
      const response = await httpRequest('POST', '/api/chats', convertToFormData());
      console.log(
        '🚀 ~ file: AddChat.jsx:64 ~ handleClick ~ response:',
        response
      );
      const chat = response.data.message;
      const chatId = chat._id;
      navigate(`/chat/${chatId}`);
    } catch (error) {
      console.log('🚀 ~ file: AddChat.jsx:63 ~ handleClick ~ error:', error);
    }
  }

  const convertToFormData = () => {
    const formDataToSend = new FormData();

    // Append each key-value pair from formData to FormData instance
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    return formDataToSend;
  };


  return (
    <main>
      <h1 className="m-3">New chat</h1>
      <div className="m-3">
        <DynamicList
          fetchDataFunction={() => httpRequest('GET', '/api/users')}
          dataKey="users"
          list={formData.buddies}
          addItem={addBuddy}
          removeItem={removeBuddy}
          showCheckboxes={true}
          showFilter={true}
        />
      </div>

      <div className="m-4 flex justify-around">
        <div>
          <button className="btn btn-secondary w-20" onClick={handleCancel}>
            Cancel
          </button>
        </div>
        <div>
          <button className="btn btn-primary w-20" onClick={handleSubmit}>
            OK
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Group Chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="my-2 mx-4">
            <div className="mt-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={handleChangeGroupName}
              />
            </div>
            <div className="mt-2">
              <Form.Label>Avatar</Form.Label>
              <Form.Control
                type="file"
                name='avatar'
                accept="image/*"
                onChange={handleChangeGroupAvatar}
              />
            </div>

            {/* Other form fields */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveModal}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
}
