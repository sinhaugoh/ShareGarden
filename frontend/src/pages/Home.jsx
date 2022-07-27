import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import HomeItemList from "../components/home/HomeItemList";
export default function Home() {
  const { user, logout } = useAuth();
  return (
    <Container className="mt-3">
      <h1>Discover</h1>
      <HomeItemList />
    </Container>
  );
}
