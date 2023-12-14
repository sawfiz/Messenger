import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

export default function AttachmentModal({ show, onHide, attachmentUrl }) {
  const [modalShow, setModalShow] = useState(show);
  const [attachmentWidth, setAttachmentWidth] = useState('auto');
  const [attachmentHeight, setAttachmentHeight] = useState('auto');

  useEffect(() => {
    // Create a new image to get the original dimensions of the attachment
    const img = new Image();
    img.src = attachmentUrl;
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      const maxWidth = 100; // Maximum width in percentage
      const maxHeight = 100; // Maximum height in percentage

      // Calculate dimensions based on the aspect ratio and maximum size
      const width = Math.min(img.width, window.innerWidth * (maxWidth / 100));
      const height = Math.min(
        img.height,
        window.innerHeight * (maxHeight / 100)
      );

      if (width / height > aspectRatio) {
        setAttachmentWidth(height * aspectRatio);
        setAttachmentHeight(height);
      } else {
        setAttachmentWidth(width);
        setAttachmentHeight(width / aspectRatio);
      }
    };
  }, [attachmentUrl]);

  const handleClose = () => {
    onHide(); // Call the onHide function to close the modal from the parent component
    setModalShow(false);
  };

  return (
    <Modal
      show={modalShow}
      onHide={handleClose}
      className="attachment-modal"
      centered
    >
      <Modal.Body>
        <div
          style={{
            width: attachmentWidth,
            height: attachmentHeight,
            position: 'relative',
            overflow: 'hidden',
            margin: '0 auto', // Center horizontally
          }}
          onClick={handleClose}
        >
          <img
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
            src={attachmentUrl}
            alt="Attachment"
          />
        </div>
      </Modal.Body>
    </Modal>
  );
}
