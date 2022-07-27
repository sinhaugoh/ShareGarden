import { Card } from "react-bootstrap";
import PropTypes from "prop-types";

export default function HomeItemCard({
  category,
  cover_image,
  description,
  title,
}) {
  return (
    <Card className="position-relative h-100">
      <div
        className="position-absolute end-0 opacity-75 bg-dark w-25"
        style={{ borderRadius: "0rem 0.375rem 0rem 0rem" }}
      >
        <div className="text-white px-2 py-1 text-center">{category}</div>
      </div>
      <Card.Img
        variant="top"
        src={cover_image}
        height="200px"
        style={{ objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text className="text-truncate">{description}</Card.Text>
        <Card.Text className="text-muted mt-auto">
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

HomeItemCard.propTypes = {
  category: PropTypes.string,
  cover_image: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
};
