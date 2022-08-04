import { Container, Button } from "react-bootstrap";
import UserInfo from "../components/profile/UserInfo";
import UserItemPostListing from "../components/profile/UserItemPostListing";

export default function Profile() {
  return (
    <Container className="my-3 bg-white p-3">
      <UserInfo />
      <hr className="my-4" />
      <UserItemPostListing />
    </Container>
  );
}
