// Library
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import httpRequest from '../utils/apiServices';

// Contexts
import { AuthContext } from '../contexts/AuthContext';
import { useModal, CustomModal } from '../contexts/ModalContext';

export default function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(AuthContext);
  const { showModal, closeModal } = useModal();

  const handleShowModal = () => {
    // Create a function to show the modal
    const modalContent = (
      <CustomModal
        show={true} // Set show to true to display the modal
        handleClose={closeModal} // Pass handleClose function to close the modal
        title="Logout" // Set the modal title
        body="Are you sure you want to logout?" // Set the modal body
        primaryAction={handleLogout}
      />
    );
    showModal(modalContent); // Show the modal by passing the modal content to showModal function
  };

  const handleLogout = async () => {
    try {
      const result = await httpRequest('POST', '/logout');
      console.log('🚀 ~ file: Header.jsx:33 ~ handleLogout ~ result:', result);
      logout();
      closeModal(); // Close the modal on button click
      navigate('/');
    } catch (error) {
      console.log('🚀 ~ file: Header.jsx:30 ~ handleLogout ~ error:', error);
    }
  };

  return (
    // With fixed="top" the Navbar is taken out of the normal flow of the DOM and require
    // custom CSS, (e.g., padding-top on the <body>) to prevent overlap with other elements.
    <Navbar collapseOnSelect fixed="top" bg="dark" expand="sm" variant="dark">
      <Container>
        <Navbar.Brand href="#">Messenger</Navbar.Brand>

        {isLoggedIn && (
          <>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav>
                {/* Use as={Link} to='/chats' to prevent app reload */}
                {/* Use href='/chats'so that collapseOnSelect works */}
                <Nav.Link as={Link} to="/chats" href="/chats">
                  {' '}
                  Chats
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" href="/profile">
                  {' '}
                  Profile
                </Nav.Link>

                {/* Use href='#'so that collapseOnSelect works */}
                <Nav.Link onClick={handleShowModal} href="#">
                  {' '}
                  Logout
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </>
        )}
      </Container>
    </Navbar>
  );
}
