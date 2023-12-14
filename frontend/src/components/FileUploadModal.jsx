import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Form } from 'react-bootstrap';

// Create a separate component for the file upload modal
function FileUploadModal({ show, onClose, onFileUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    // Pass the selected file to the parent component
    onClose();
    onFileUpload(selectedFile);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Attachment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="file"
          name="attachment"
          accept="image/*"
          onChange={handleFileChange}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpload}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

FileUploadModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFileUpload: PropTypes.func.isRequired,
};

export default FileUploadModal;
