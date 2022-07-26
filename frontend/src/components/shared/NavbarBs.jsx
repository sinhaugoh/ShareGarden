import {
  Form,
  Nav,
  Navbar,
  NavDropdown,
  Container,
  Button,
  Image,
} from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink, Link } from "react-router-dom";

export default function NavbarBs() {
  const { user, logout } = useAuth();
  return (
    <Navbar expand="lg" sticky="top" className="bg-white shadow-sm">
      <Container>
        <Navbar.Brand to="/" as={Link}>
          ShareGarden
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Form className="d-flex m-auto mt-3 mt-lg-0">
            <Form.Control
              type="search"
              placeholder="Tomato seeds..."
              aria-label="Search"
              className="me-2"
            />
            <Button>Search</Button>
          </Form>
          <Nav>
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
  // return (
  //   <Navbar bg="light" expand="lg" fixed="top">
  //     <Container>
  //       <Navbar.Brand href="#home">ShareGarden</Navbar.Brand>
  //       <Navbar.Toggle aria-controls="basic-navbar-nav" />
  //       <Navbar.Collapse id="basic-navbar-nav">
  //         <Nav>
  //           <Form className="d-flex">
  //             <Form.Control
  //               type="search"
  //               placeholder="Tomato seeds..."
  //               aria-label="Search"
  //               className="me-2"
  //             />
  //             <Button>Search</Button>
  //           </Form>
  //           <Nav.Link href="#home">Home</Nav.Link>
  //           <Nav.Link href="#link">Link</Nav.Link>
  //           <NavDropdown
  //             title={
  //               <Image
  //                 src={
  //                   user.profile_image === null
  //                     ? "/static/default_profile_pic.png"
  //                     : user.profile_image
  //                 }
  //                 style={{
  //                   width: "30px",
  //                   height: "30px",
  //                 }}
  //                 roundedCircle
  //               />
  //             }
  //             id="basic-nav-dropdown"
  //           >
  //             <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
  //             <NavDropdown.Item href="#action/3.2">
  //               Another action
  //             </NavDropdown.Item>
  //             <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
  //             <NavDropdown.Divider />
  //             <NavDropdown.Item href="#action/3.4">
  //               Separated link
  //             </NavDropdown.Item>
  //           </NavDropdown>
  //         </Nav>
  //       </Navbar.Collapse>
  //     </Container>
  //   </Navbar>
  // );
}
