import { useEffect } from "react";
import { Container, Row, Col, Image, Button, Carousel } from "react-bootstrap";
import useFetch from "../hooks/useFetch";
import { useParams } from "react-router-dom";
import { DEFAULT_PROFILE_PIC_PATH, Category, ItemType } from "../constants";
import { Link } from "react-router-dom";

export default function ItemPostDetail() {
  const { id } = useParams();
  const { data, isLoading, error } = useFetch(`/api/itempost/${id}/`);
  console.log("data", data);
  console.log("error", error);

  //TODO: implement loading
  if (isLoading) return <h1>Loading...</h1>;
  if (error)
    return <p>Failed to load the page. Please contact admin for assistance.</p>;

  return (
    <Container className="my-3">
      <Row className="mb-3">
        <Col className="d-flex flex-row align-items-center justify-content-between flex-wrap gap-3">
          <div className="d-flex flex-row align-items-center gap-3">
            <Image
              roundedCircle
              src={data.created_by.profile_image ?? DEFAULT_PROFILE_PIC_PATH}
              height="70px"
              style={{ objectFit: "cover" }}
            />
            <h3>
              <span className="fs-1 font-weight-bold">
                {data?.created_by?.username}
              </span>{" "}
              is{" "}
              {data.category === Category.GIVEAWAY
                ? "giving away"
                : data.category === Category.LEND
                ? "lending out"
                : "requesting for"}
            </h3>
          </div>
          <Button
            size="lg"
            style={{ width: "200px" }}
            onClick={() => console.log("haha")}
          >
            Contact
          </Button>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <Carousel interval={null}>
            <Carousel.Item>
              <img
                className="item-detail-carousel-img"
                src={data.cover_image}
                alt="cover"
              />
            </Carousel.Item>
            {data.itempostimage_set.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  className="item-detail-carousel-img"
                  src={image.image}
                  alt="item"
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
        <Col md={6}>
          <h1 className="font-weight-bold">{data.title}</h1>
          <h4>Description</h4>
          <p className="text-break" style={{ maxHeight: "200px" }}>
            {data.description ? data.description : "No description provided"}
          </p>
          <Row>
            <Col sm={6}>
              <h4>
                {data.category === Category.REQUEST
                  ? "Requesting amount"
                  : "Available amount"}
              </h4>
              <p>{data.quantity}</p>
            </Col>
            {data.category !== Category.REQUEST && (
              <Col sm={6}>
                <h4>Location</h4>
                <p>{data.location}</p>
              </Col>
            )}
          </Row>
          <h4>Pick up information</h4>
          <p>{data.pick_up_information}</p>
        </Col>
      </Row>
      {data.category === Category.GIVEAWAY &&
        data.item_type === ItemType.SEED_OR_PLANT && (
          <div>
            <hr />
            <Row>
              <h3>Additional seed/plant information</h3>
              <Col md={6}>
                <h4>Characteristic</h4>
                <p>
                  {data.characteristics === "None" || !data.characteristics
                    ? "No information provided"
                    : data.characteristics}
                </p>
                <h4>Water requirement</h4>
                <p>
                  {data.water_requirement === "None" || !data.water_requirement
                    ? "No information provided"
                    : data.water_requirement}
                </p>
                <h4>Soil type</h4>
                <p>
                  {data.soil_type === "None" || !data.soil_type
                    ? "No information provided"
                    : data.soil_type}
                </p>
              </Col>
              <Col md={6}>
                <h4>Growing tips</h4>
                <p>
                  {data.growing_tips === "None" || !data.growing_tips
                    ? "No information provided"
                    : data.growing_tips}
                </p>
                <h4>Light requirement</h4>
                <p>
                  {data.light_requirement === "None" || !data.light_requirement
                    ? "No information provided"
                    : data.light_requirement}
                </p>
              </Col>
            </Row>
          </div>
        )}
    </Container>
  );
}
