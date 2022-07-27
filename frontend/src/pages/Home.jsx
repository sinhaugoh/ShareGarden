import { Container } from "react-bootstrap";
import HomeItemList from "../components/home/HomeItemList";

export default function Home() {
  return (
    <Container className="mt-3">
      <h1 className="mb-3">Discover</h1>
      <HomeItemList />
    </Container>
  );
}
