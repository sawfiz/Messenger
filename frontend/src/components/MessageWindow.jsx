import { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import axiosJWT from '../utils/axiosJWT';

// Components
import FileUploadModal from './FileUploadModal';

// Styling
import { Button, Form } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';

export default function MessageWindow({ onSendMessage, chatId }) {
  const { currentUser } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    chatId: chatId,
    text: '',
    attachment: null,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.text) return;

    handleSave();
  };

  const handleSave = async () => {
    try {
      const response = await axiosJWT.post(
        '/api/messages',
        convertToFormData()
      );

      console.log('Message sent successfully:', response);

      const response2 = await axiosJWT.patch(`/api/chats/${chatId}`, {
        latest: new Date(),
      });

      onSendMessage();
      setFormData({
        sender: currentUser._id,
        chatId: chatId,
        attachment: null,
      });
      setFormData((prev) => ({ ...prev, text: '' }));
    } catch (error) {
      console.log(
        '🚀 ~ file: MessageWindow.jsx:56 ~ handleSubmit ~ error:',
        error
      );
    }
  };

  const handleAttachment = () => {
    // Show the modal when the attachment button is clicked
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleFileUpload = (file) => {
    // Handle file upload logic here (send file to API, etc.)
    // You may use this function to upload the file to the server
    console.log('Selected file:', file);
    setFormData((prevData) => ({
      ...prevData,
      attachment: file,
    }));
  };

  useEffect(() => {
    if (formData.attachment !== null) {
      handleSave();
    }
  }, [formData.attachment]);

  const convertToFormData = () => {
    // Add a timestamp to formData
    const updatedFormData = {
      ...formData,
      sender: currentUser._id,
      date: new Date(),
    };
    console.log(updatedFormData);

    const formDataToSend = new FormData();

    for (const key in updatedFormData) {
      formDataToSend.append(key, updatedFormData[key]);
    }

    return formDataToSend;
  };

  return (
    <div>
      <div className="p-2">
        <Form onSubmit={handleSubmit}>
          <div className="flex gap-1">
            <Button variant="light" onClick={handleAttachment}>
              📎
            </Button>
            <Form.Control
              type="text"
              name="text"
              placeholder="Message..."
              value={formData.text}
              onChange={handleChange}
              autoFocus
            />
          </div>
        </Form>
      </div>

      <FileUploadModal
        show={showModal}
        onClose={handleCloseModal}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
}

// Prop Types validation
MessageWindow.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  chatId: PropTypes.string.isRequired,
};
