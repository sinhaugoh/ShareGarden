import {
  Form,
  Nav,
  Navbar,
  NavDropdown,
  Container,
  Button,
} from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink, Link } from "react-router-dom";
import { useCreateItemPost } from "../../contexts/CreateItemPostContext";

export default function NavbarBs() {
  const { user, logout } = useAuth();
  const { toggleCreateItemPostModal } = useCreateItemPost();
  return (
    <Navbar expand="lg" sticky="top" className="bg-white shadow-sm">
      <Container>
        <Navbar.Brand to="/" as={Link}>
          ShareGarden
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          {user ? (
            <Form className="d-flex ms-auto mt-3 mt-lg-0">
              <Form.Control
                type="search"
                placeholder="Tomato seeds..."
                aria-label="Search"
                className="me-2"
              />
              <Button>Search</Button>
            </Form>
          ) : null}
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link to="/chatroom/" as={NavLink}>
                  Chat
                </Nav.Link>
                <NavDropdown title={user?.username} align="end">
                  <NavDropdown.Item>My profile</NavDropdown.Item>
                  <NavDropdown.Item>My listing</NavDropdown.Item>
                  <NavDropdown.Item>My deals</NavDropdown.Item>
                  <NavDropdown.Item as="button" onClick={logout}>
                    Sign out
                  </NavDropdown.Item>
                </NavDropdown>
                <Button
                  className="shadow-none"
                  onClick={toggleCreateItemPostModal}
                >
                  Share resources
                </Button>
              </>
            ) : (
              <>
                <Button className="me-3" href="/login/">
                  Sign in
                </Button>
                <Button to="/register/" as={Link}>
                  Sign up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
