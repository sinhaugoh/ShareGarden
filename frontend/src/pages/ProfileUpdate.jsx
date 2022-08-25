import { useState } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Card,
  Image,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TextFieldBs from "../components/shared/form/TextFieldBs";
import TextAreaFieldBs from "../components/shared/form/TextAreaFieldBs";
import LocationAutocompleteFieldBs from "../components/shared/form/LocationAutocompleteFieldBs";
import { useAuth } from "../contexts/AuthContext";
import { GOOGLE_MAP_API_KEY } from "../constants";
import { getCookie } from "../utils";

export default function ProfileUpdate() {
  const { user, fetchAuthUser } = useAuth();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [formInputs, setFormInputs] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData();
    for (const key in formInputs) {
      if (key === "profile_image") {
        if (formInputs[key].length > 0) {
          formData.append(key, formInputs[key]?.[0], formInputs[key]?.[0].name);
        }
        continue;
      }

      if (formInputs[key] !== null && formInputs[key] !== undefined) {
        formData.append(key, formInputs[key]);
      }
    }

    // Display the key/value pairs
    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    setIsSubmitting(true);
    let response = await fetch("/api/account/update/", {
      method: "PATCH",
      body: formData,
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    });

    if (response.status === 200) {
      console.log("user profile updated!");
      // refetch auth user
      await fetchAuthUser();
      navigate(-1);
    } else if (response.status === 400) {
      const data = await response.json();
      setFormErrors(data);
      console.log("error", data);
    }

    setIsSubmitting(false);
  }

  function handleChange(event) {
    setFormInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  }

  function handleImageUploadChange(event) {
    setFormInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.files,
    }));
  }

  function handleLocationChange(newAddress) {
    setFormInputs((inputs) => ({
      ...inputs,
      address: newAddress,
    }));
  }

  return (
    <Container className="mt-3 p-3">
      <Row className="d-flex justify-content-center">
        <Col sm={8} md={7} lg={6}>
          <Card>
            <Card.Body>
              <Card.Title className="mb-3">Update profile</Card.Title>
              <Form className="d-flex flex-column">
                <Image
                  src={user.profile_image ?? "/static/default_profile_pic.png"}
                  roundedCircle
                  thumbnail
                  className="align-self-center mb-3"
                  style={{ objectFit: "cover", height: 200, aspectRatio: 1 }}
                />
                <Form.Group className="mb-3">
                  <Form.Label>Reupload profile image</Form.Label>
                  <Form.Control
                    className={formErrors.profile_image && "is-invalid"}
                    name="profile_image"
                    type="file"
                    onChange={handleImageUploadChange}
                    accept="image/png, image/jpeg"
                  />
                  {formErrors.profile_image && (
                    <Form.Text className="invalid-feedback">
                      {formErrors.profile_image}
                    </Form.Text>
                  )}
                </Form.Group>
                <TextFieldBs
                  className="mb-3"
                  label="Username"
                  name="username"
                  defaultValue={user.username}
                  disabled
                />
                <TextAreaFieldBs
                  className="mb-3"
                  label="About"
                  name="about"
                  onChange={handleChange}
                  defaultValue={user.about ?? ""}
                  rows={3}
                />
                <LocationAutocompleteFieldBs
                  className="mb-3"
                  label="Address"
                  name="address"
                  onChange={handleLocationChange}
                  apiKey={GOOGLE_MAP_API_KEY}
                  defaultValue={user.address}
                  hintText="Filling in address allows us to better show you the item post nearby."
                  error={formErrors.address}
                />
                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="me-2"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
