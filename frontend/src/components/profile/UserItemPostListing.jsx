import { Row, Accordion, Col } from "react-bootstrap";
import useFetch from "../../hooks/useFetch";
import { useParams } from "react-router-dom";
import HomeItemCard from "../home/HomeItemCard";

export default function UserItemPostListing() {
  const { username } = useParams();
  const { data, isLoading, error } = useFetch(
    `/api/itemposts/?username=${username}`
  );

  console.log("data", data);
  console.log("error", error);

  //TODO: implement loading
  if (isLoading) return <h1>Loading...</h1>;
  if (error)
    //TODO: implement 404 page
    return (
      <p>
        Some error occured. Please contact admin for assistance. {error.message}
      </p>
    );

  return (
    <Row>
      <Col>
        <Accordion alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h4>Active listing</h4>
            </Accordion.Header>
            <Accordion.Body>
              <Row lg={3} md={2} sm={1} xs={1}>
                {data?.map((itemPost) => {
                  // render only active item post
                  if (!itemPost.is_active) return null;

                  return (
                    <Col className="mb-3" key={itemPost.id}>
                      <HomeItemCard {...itemPost} />
                    </Col>
                  );
                })}
              </Row>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <h4>Inactive listing</h4>
            </Accordion.Header>
            <Accordion.Body>
              <Row lg={3} md={2} sm={1} xs={1}>
                {data?.map((itemPost) => {
                  // render only inactive item post
                  if (itemPost.is_active) return null;

                  return (
                    <Col className="mb-3" key={itemPost.id}>
                      <HomeItemCard {...itemPost} />
                    </Col>
                  );
                })}
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Col>
    </Row>
  );
}