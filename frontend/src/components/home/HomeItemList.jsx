import HomeItemCard from "./HomeItemCard";
import { Row, Col } from "react-bootstrap";
import { useEffect } from "react";
import useFetch from "../../hooks/useFetch";

export default function HomeItemList() {
  const { data, loading, error } = useFetch("/api/itempost/");

  console.log(data);
  if (loading) return <h1>Loading...</h1>;

  return (
    <Row lg={3} md={2} sm={1} xs={1}>
      {data?.map((postItem) => {
        return (
          <Col className="mb-3" key={postItem.id}>
            <HomeItemCard {...postItem} />
          </Col>
        );
      })}
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
