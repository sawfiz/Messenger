import React from 'react';
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
              <Nav.Link> Profile</Nav.Link>
              <Nav.Link> Logout</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
