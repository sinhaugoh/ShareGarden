import { Row, Col, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { DEFAULT_PROFILE_PIC_PATH } from "../../constants.js";
import useFetch from "../../hooks/useFetch";
import { useAuth } from "../../contexts/AuthContext";

export default function UserInfo() {
  const { username } = useParams();
  const { user } = useAuth();

  const GET_USER_API_PATH = `/api/user/${username}`;
  const { data, isLoading, error } = useFetch(GET_USER_API_PATH);

  console.log("error", error);

  //TODO: implement loading
  if (isLoading) return <h1>Loading...</h1>;
  if (error) {
    return (
      <p>
        Something went wrong. Please contact admin for assistance.{" "}
        {error.message}
      </p>
    );
  }

  return (
    <Row>
      <Col
        md={6}
        lg={5}
        className="d-flex align-items-center justify-content-center"
      >
        <Image
          thumbnail
          roundedCircle
          src={
            data.username === user.username
              ? user.profile_image ?? DEFAULT_PROFILE_PIC_PATH
              : data.profile_image ?? DEFAULT_PROFILE_PIC_PATH
          }
          className="profile-page-profile-img"
        />
      </Col>
      <Col md={6} lg={7} className="d-flex flex-column justify-content-center">
        <h1>
          {data.username === user.username ? user.username : data.username}
        </h1>
        <h5 className="mt-4">About</h5>
        <p>
          {data.username === user.username
            ? user.about ?? "No information provided."
            : data.about ?? "No information provided."}
        </p>
      </Col>
    </Row>
  );
}
