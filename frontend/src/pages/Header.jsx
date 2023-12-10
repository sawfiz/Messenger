import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Button } from 'react-bootstrap';

import { useModal, CustomModal } from '../contexts/ModalContext';

export default function Header() {
  const { showModal, closeModal } = useModal();

  const handleShowModal = () => {
    // Create a function to show the modal
    const modalContent = (
      <CustomModal
        show={true} // Set show to true to display the modal
        handleClose={closeModal} // Pass handleClose function to close the modal
        title="Logoutl" // Set the modal title
        body="Are you sure you want to logout?" // Set the modal body
        primaryAction={handleLogout}
      />
    );
    showModal(modalContent); // Show the modal by passing the modal content to showModal function
  };

  const handleLogout = () => {
    console.log('Confirm button clicked');
    closeModal(); // Close the modal on button click
  };

  return (
    <>
      <Navbar collapseOnSelect fixed="top" bg="dark" expand="sm" variant="dark">
        <Container>
          <Navbar.Brand href="#">Messenger</Navbar.Brand>
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
        </Container>
      </Navbar>
    </>
  );
}
