import {
  Form,
  Nav,
  Navbar,
  NavDropdown,
  Container,
  Button,
} from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useCreateItemPost } from "../../contexts/CreateItemPostContext";

export default function NavbarBs() {
  const { user, logout } = useAuth();
  const { toggleCreateItemPostModal } = useCreateItemPost();
  const navigate = useNavigate();
  return (
    <Navbar expand="lg" sticky="top" className="bg-white shadow-sm">
      <Container>
        <Navbar.Brand to="/" as={Link} className="fs-2 fw-lighter">
          ShareGarden
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link to="/chatlist/" as={NavLink}>
                  Chat
                </Nav.Link>
                <NavDropdown title={user?.username} align="end">
                  <NavDropdown.Item
                    onClick={() => navigate(`/profile/${user.username}/`)}
                  >
                    My profile
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => navigate("/account/update/")}
                  >
                    Edit profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate("/transactions/")}>
                    Transactions
                  </NavDropdown.Item>
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
