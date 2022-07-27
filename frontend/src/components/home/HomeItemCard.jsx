import { Card } from "react-bootstrap";
export default function HomeItemCard() {
  return (
    <Card className="position-relative">
      <div
        className="position-absolute end-0 opacity-75 bg-dark"
        style={{ borderRadius: "0rem 0.375rem 0rem 0rem" }}
      >
        <div className="text-white px-2 py-1">Giveaway</div>
      </div>
      <Card.Img
        variant="top"
        src="/static/default_profile_pic.png"
        height="200px"
        style={{ objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title>Tomato seeds</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content
        </Card.Text>
        <Card.Text className="text-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            viewBox="0 0 18 18"
          >
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"></path>
          </svg>{" "}
          0.9km away
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
