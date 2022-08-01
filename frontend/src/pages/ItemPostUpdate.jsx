import { Container, Form, Row, Col, Accordion, Button } from "react-bootstrap";
import useFetch from "../hooks/useFetch";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Category,
  ItemType,
  WaterRequirement,
  SoilType,
  LightRequirement,
  MAXIMUM_POST_IMAGE_COUNT,
  GOOGLE_MAP_API_KEY,
} from "../constants";
import { getCookie } from "../utils";
import SelectFieldBs from "../components/shared/form/SelectFieldBs";
import TextFieldBs from "../components/shared/form/TextFieldBs";
import TextAreaFieldBs from "../components/shared/form/TextAreaFieldBs";
import LocationAutocompleteFieldBs from "../components/shared/form/LocationAutocompleteFieldBs";

export default function ItemPostUpdate() {
  const { id } = useParams();
  const { data, isLoading, error } = useFetch(`/api/itempost/${id}/`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  // set form default inputs if initial data has been loaded
  const [formInputs, setFormInputs] = useState({});
  const navigate = useNavigate();
  console.log("formInputs", formInputs);

  useEffect(() => {
    setFormInputs({
      category: data?.category,
      item_type: data?.item_type,
      title: data?.title,
      description: data?.description,
      quantity: data?.quantity,
      pick_up_information: data?.pick_up_information,
      location: data?.location,
      characteristics: data?.characteristics,
      days_to_harvest: data?.days_to_harvest,
      water_requirement: data?.water_requirement,
      soil_type: data?.soil_type,
      light_requirement: data?.light_requirement,
      growing_tips: data?.growing_tips,
    });
  }, [data]);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();

    for (const key in formInputs) {
      // loop through each image in images property
      if (key === "images") {
        for (const image of formInputs[key]) {
          formData.append(key, image, image.name);
        }
        continue;
      }

      if (key === "cover_image") {
        console.log("heloo");
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
    let response = await fetch(`/api/itempost/${id}/`, {
      method: "PATCH",
      body: formData,
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    });

    if (response.status === 200) {
      console.log("post updated!!");
      navigate(`/itempost/${id}/`);
    } else if (response.status === 400) {
      let data = await response.json();
      setFormErrors(data);
      console.log("error 400", data);
    }
    setIsSubmitting(false);
  }

  function handleChange(event) {
    setFormInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  }

  function handleLocationChange(newLocation) {
    setFormInputs((inputs) => ({
      ...inputs,
      location: newLocation,
    }));
  }

  function handleImageUploadChange(event) {
    setFormInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.files,
    }));
  }

  //TODO: implement loading
  if (isLoading) return <h1>Loading...</h1>;
  if (error) {
    return <p>Failed to load the page. Please contact admin for assistance.</p>;
  }

  // // set default form input if initial data is retrieved
  // setFormInputs({
  //   images: data.itempostimage_set,
  // });

  console.log(data);
  return (
    <Container className="my-3 bg-white p-3">
      <h1 className="mb-3">Update {data.title}</h1>
      <Form>
        <Row>
          <Col sm={6} className="mb-3">
            <SelectFieldBs
              label="Category"
              name="category"
              onChange={handleChange}
              selectionObject={Category}
              defaultValue={data.category}
            />
          </Col>
          <Col sm={6} className="mb-3">
            <SelectFieldBs
              label="Item type"
              name="item_type"
              onChange={handleChange}
              selectionObject={ItemType}
              defaultValue={data.item_type}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={6} className="mb-3">
            {/*
            <Image
              thumbnail
              src={data.cover_image}
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
            {formInputs.cover_image ? (
              <Button>Delete</Button>
            ) : (
              <>
                <Form.Control
                  className={formErrors.cover_image && "is-invalid"}
                  name="cover_image"
                  type="file"
                  onChange={handleSingleImageUploadChange}
                  accept="image/png, image/jpeg"
                />
                {formErrors.cover_image && (
                  <Form.Text className="invalid-feedback">
                    {formErrors.cover_image}
                  </Form.Text>
                )}
              </>
            )}
      */}
            <Form.Group>
              <Form.Label>Reupload cover image</Form.Label>
              <Form.Control
                className={formErrors.cover_image && "is-invalid"}
                name="cover_image"
                type="file"
                onChange={handleImageUploadChange}
                accept="image/png, image/jpeg"
              />
              {formErrors.cover_image && (
                <Form.Text className="invalid-feedback">
                  {formErrors.cover_image}
                </Form.Text>
              )}
            </Form.Group>
          </Col>
          <Col sm={6} className="mb-3">
            <Form.Group>
              <Form.Label>Reupload image(s)</Form.Label>
              <Form.Control
                className={formErrors.images && "is-invalid"}
                name="images"
                type="file"
                multiple
                onChange={handleImageUploadChange}
                accept="image/png, image/jpeg"
              />
              <Form.Text>
                Maximum of {MAXIMUM_POST_IMAGE_COUNT} images are allowed.
              </Form.Text>
              {formErrors.images && (
                <Form.Text className="invalid-feedback">
                  {formErrors.images}
                </Form.Text>
              )}
            </Form.Group>
          </Col>
        </Row>
        <TextFieldBs
          className="mb-3"
          label="Title"
          name="title"
          onChange={handleChange}
          error={formErrors.title}
          defaultValue={data.title}
        />
        <TextAreaFieldBs
          className="mb-3"
          label="Description (optional)"
          name="description"
          rows={3}
          onChange={handleChange}
          error={formErrors.description}
          defaultValue={data.description}
        />
        <Form.Group className="mb-3">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            className={formErrors.quantity && "is-invalid"}
            type="number"
            min="1"
            max="100"
            defaultValue={data.quantity}
            step="1"
            name="quantity"
            onChange={handleChange}
          />
          {formErrors.quantity && (
            <Form.Text className="invalid-feedback">
              {formErrors.quantity}
            </Form.Text>
          )}
        </Form.Group>
        <TextAreaFieldBs
          className="mb-3"
          label="Pick up information"
          rows={3}
          placeholder={
            formInputs.category === Category.LEND
              ? "e.g. Lending for 3 days. Collection at my house."
              : formInputs.category === Category.REQUEST
              ? "e.g. I can come over to your place during weekend."
              : "e.g. Saturday 9pm onwards."
          }
          name="pick_up_information"
          onChange={handleChange}
          error={formErrors.pick_up_information}
          defaultValue={data.pick_up_information}
        />
        <LocationAutocompleteFieldBs
          className="mb-3"
          label="Pick up location"
          name="location"
          onChange={handleLocationChange}
          error={formErrors.location}
          apiKey={GOOGLE_MAP_API_KEY}
          defaultValue={data.location}
        />

        {formInputs.category === Category.GIVEAWAY &&
          formInputs.item_type === ItemType.SEED_OR_PLANT && (
            <>
              <TextAreaFieldBs
                className="mb-3"
                label="Seed/plant characteristics"
                rows={3}
                placeholder="Red in color. Spicy..."
                name="characteristics"
                onChange={handleChange}
                error={formErrors.characteristics}
                defaultValue={data.characteristics}
              />
              <Row className="mb-3">
                <Col sm={6}>
                  <Form.Group>
                    <Form.Label>Days to harvest (optional)</Form.Label>
                    <Form.Control
                      className={formErrors.days_to_harvest && "is-invalid"}
                      type="number"
                      step="1"
                      name="days_to_harvest"
                      onChange={handleChange}
                      defaultValue={data.days_to_harvest}
                    />
                    {formErrors.days_to_harvest && (
                      <Form.Text className="invalid-feedback">
                        {formErrors.days_to_harvest}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <SelectFieldBs
                    label="Water requirements"
                    name="water_requirement"
                    onChange={handleChange}
                    selectionObject={WaterRequirement}
                    defaultValue={data.water_requirement}
                  />
                </Col>
              </Row>
              <Accordion className="mb-3">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    Additional seed/plant information
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col sm={6}>
                        <SelectFieldBs
                          className="mb-3"
                          label="Soil type"
                          name="soil_type"
                          onChange={handleChange}
                          selectionObject={SoilType}
                          defaultValue={data.soil_type}
                        />
                      </Col>
                      <Col sm={6}>
                        <SelectFieldBs
                          className="mb-3"
                          label="Light requirement"
                          name="light_requirement"
                          onChange={handleChange}
                          selectionObject={LightRequirement}
                          defaultValue={data.light_requirement}
                        />
                      </Col>
                    </Row>
                    <TextAreaFieldBs
                      className="mb-3"
                      label="Important growing tips (optional)"
                      rows={3}
                      name="growing_tips"
                      onChange={handleChange}
                      error={formErrors.growing_tips}
                      defaultValue={data.growing_tips}
                    />
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </>
          )}
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
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </div>
      </Form>
    </Container>
  );
}
