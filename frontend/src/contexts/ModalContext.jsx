import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalContent, setModalContent] = useState(null);

  // Function to show the modal
  const showModal = (content) => {
    setModalContent(content);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}
      {modalContent}
    </ModalContext.Provider>
  );
};

ModalProvider.propTypes = {
  children: PropTypes.node // Add PropTypes validation for 'children'
};

// Reusable modal component used for providing info or alter error
// User is only provided a OK button
export const InfoModal = ({
  show,
  handleClose,
  title,
  body,
  primaryAction,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={primaryAction}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

InfoModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.node.isRequired,
  primaryAction: PropTypes.func.isRequired,
};

// Reusable modal component
// User is provided Confirm and Close Buttons
export const CustomModal = ({
  show,
  handleClose,
  title,
  body,
  primaryAction,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={primaryAction}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

CustomModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.node.isRequired,
  primaryAction: PropTypes.func.isRequired,
};

// Reusable modal component
// User is provided Confirm and Close Buttons
export const ConfirmModal = ({
  show,
  handleClose,
  title,
  body,
  primaryAction,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={primaryAction}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.node.isRequired,
  primaryAction: PropTypes.func.isRequired,
};

// Hook to access modal context and functions
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
