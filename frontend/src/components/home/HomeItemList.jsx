import HomeItemCard from "./HomeItemCard";
import { Row, Col } from "react-bootstrap";

export default function HomeItemList() {
  return (
    <Row lg={3} md={2} sm={1} xs={1}>
      <Col className="mb-3">
        <HomeItemCard />
      </Col>
      <Col className="mb-3">
        <HomeItemCard />
      </Col>
      <Col className="mb-3">
        <HomeItemCard />
      </Col>
      <Col className="mb-3">
        <HomeItemCard />
      </Col>
      <Col className="mb-3">
        <HomeItemCard />
      </Col>
      <Col className="mb-3">
        <HomeItemCard />
      </Col>
      <Col className="mb-3">
        <HomeItemCard />
      </Col>
    </Row>
  );
}
