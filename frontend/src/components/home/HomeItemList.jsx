import HomeItemCard from "./HomeItemCard";
import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function HomeItemList() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    (async function () {
      try {
        setIsLoading(true);
        const response = await fetch("/api/itemposts/");
        const data = await response.json();

        if (response.status === 400) {
          setError(data);
        } else if (response.status > 400 && response.status < 600) {
          throw new Error(`Error with status: ${response.status}`);
        }

        setData(data);
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user]);

  if (isLoading) return <h1>Loading...</h1>;
  if (error)
    return (
      <p>Some error has occured. Please reload the page or contact admin.</p>
    );

  return (
    <Row lg={3} md={2} sm={1} xs={1}>
      {data?.map((postItem) => {
        return (
          <Col className="mb-3" key={postItem.id}>
            <HomeItemCard {...postItem} />
          </Col>
        );
      })}
    </Row>
  );
}
