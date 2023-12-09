import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

export default function Header() {
  return (
    <>
      <Navbar collapseOnSelect fixed="top" bg="dark" expand="sm" variant="dark">
        <Container>
          <Navbar.Brand href='#'>Messenger</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav>
              <Nav.Link as={Link} to='/chats'> Chats</Nav.Link>
              <Nav.Link as={Link} to='/profile'> Profile</Nav.Link>
              <Nav.Link> Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
