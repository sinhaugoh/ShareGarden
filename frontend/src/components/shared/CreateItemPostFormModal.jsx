import { Accordion, Row, Col, Form, Modal, Button } from "react-bootstrap";
import TextFieldBs from "./form/TextFieldBs";
import SelectFieldBs from "./form/SelectFieldBs";
import TextAreaFieldBs from "./form/TextAreaFieldBs";
import LocationAutocompleteFieldBs from "./form/LocationAutocompleteFieldBs";
import { useState } from "react";
import {
  Category,
  ItemType,
  WaterRequirement,
  SoilType,
  LightRequirement,
} from "../../constants";
import { useCreateItemPost } from "../../contexts/CreateItemPostContext";
import { MAXIMUM_POST_IMAGE_COUNT, GOOGLE_MAP_API_KEY } from "../../constants";
import { getCookie } from "../../utils";

export default function CreateItemPostFormModal() {
  const DEFAULT_STATE = {
    category: Object.values(Category)[0],
    item_type: Object.values(ItemType)[0],
    quantity: "1",
    water_requirement: Object.values(WaterRequirement)[0],
    soil_type: Object.values(SoilType)[0],
    light_requirement: Object.values(LightRequirement)[0],
  };
  const { isOpenCreateItemPostModal, toggleCreateItemPostModal } =
    useCreateItemPost();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formInputs, setFormInputs] = useState(DEFAULT_STATE);

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
        formData.append(key, formInputs[key]?.[0], formInputs[key]?.[0].name);
        continue;
      }

      formData.append(key, formInputs[key] ?? "");
    }

    setIsSubmitting(true);
    let response = await fetch("/api/itemposts/", {
      method: "POST",
      body: formData,
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    });

    if (response.status === 201) {
      console.log("post created!!");
      clearFormData();
      toggleCreateItemPostModal();
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

  function handleSingleImageUploadChange(event) {
    setFormInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.files,
    }));
  }

  function handleMultipleImagesUploadChange(event) {
    let images = event.target.files;
    if (images && images.length > 0) {
      setFormInputs((inputs) => ({
        ...inputs,
        [event.target.name]: images,
      }));
    }
  }

  function clearFormData() {
    // clear form inputs and errors after the user close the modal
    setFormInputs(DEFAULT_STATE);
    setFormErrors({});
  }

  console.log("form input", formInputs);

  return (
    <Modal
      show={isOpenCreateItemPostModal}
      size="lg"
      backdrop="static"
      scrollable={true}
      keyboard={false}
      onHide={() => {
        clearFormData();
        toggleCreateItemPostModal();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Share resources</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col sm={6} className="mb-3">
              <SelectFieldBs
                label="Category"
                name="category"
                onChange={handleChange}
                selectionObject={Category}
              />
              {/*

              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select name="category" onChange={handleChange}>
                  {Object.keys(Category).map((key, index) => (
                    <option value={Category[key]} key={index}>
                      {Category[key]}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
      */}
            </Col>
            <Col sm={6} className="mb-3">
              <SelectFieldBs
                label="Item type"
                name="item_type"
                onChange={handleChange}
                selectionObject={ItemType}
              />
              {/*
              <Form.Group>
                <Form.Label>Item type</Form.Label>
                <Form.Select name="item_type" onChange={handleChange}>
                  {Object.keys(ItemType).map((key, index) => (
                    <option value={ItemType[key]} key={index}>
                      {ItemType[key]}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
      */}
            </Col>
          </Row>
          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group>
                <Form.Label>Cover image</Form.Label>
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
              </Form.Group>
            </Col>
            <Col sm={6} className="mb-3">
              <Form.Group>
                <Form.Label>Image(s)</Form.Label>
                <Form.Control
                  className={formErrors.images && "is-invalid"}
                  name="images"
                  type="file"
                  multiple
                  onChange={handleSingleImageUploadChange}
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
          />
          {/*
<Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              className={formErrors.title && "is-invalid"}
              type="text"
              name="title"
              onChange={handleChange}
            />
            {formErrors.title && (
              <Form.Text className="invalid-feedback">
                {formErrors.title}
              </Form.Text>
            )}
         </Form.Group> 
      */}

          <TextAreaFieldBs
            className="mb-3"
            label="Description (optional)"
            name="description"
            rows={3}
            onChange={handleChange}
            error={formErrors.description}
          />
          {/*
          <Form.Group className="mb-3">
            <Form.Label>Description (optional)</Form.Label>
            <Form.Control
              className={formErrors.description && "is-invalid"}
              as="textarea"
              name="description"
              rows={3}
              onChange={handleChange}
            />
            {formErrors.description && (
              <Form.Text className="invalid-feedback">
                {formErrors.description}
              </Form.Text>
            )}
          </Form.Group>
      */}
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              className={formErrors.quantity && "is-invalid"}
              type="number"
              min="1"
              max="100"
              defaultValue="1"
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
          />
          {/*
          <Form.Group className="mb-3">
            <Form.Label>Pick up information</Form.Label>
            <Form.Control
              as="textarea"
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
            />
          </Form.Group>
      */}
          <LocationAutocompleteFieldBs
            className="mb-3"
            label="Pick up location"
            name="location"
            onChange={handleLocationChange}
            error={formErrors.location}
            apiKey={GOOGLE_MAP_API_KEY}
          />
          {/*

          <Form.Group className="mb-3">
            <Form.Label>Pick up location</Form.Label>
            <Form.Control type="text" name="location" onChange={handleChange} />
          </Form.Group>
      */}

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
                />
                {/*
                <Form.Group className="mb-3">
                  <Form.Label>Seed/plant characteristics</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Red in color. Spicy..."
                    name="characteristics"
                    onChange={handleChange}
                  />
                </Form.Group>
                */}
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
                    />
                    {/*
                    <Form.Group>
                      <Form.Label>Water Requirements</Form.Label>
                      <Form.Select
                        name="water_requirement"
                        onChange={handleChange}
                      >
                        {Object.keys(WaterRequirement).map((key, index) => (
                          <option value={WaterRequirement[key]} key={index}>
                            {WaterRequirement[key]}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                */}
                  </Col>
                </Row>
                <Accordion>
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
                          />
                          {/*
                          <Form.Group>
                            <Form.Label>Soil type</Form.Label>
                            <Form.Select
                              name="soil_type"
                              onChange={handleChange}
                            >
                              {Object.keys(SoilType).map((key, index) => (
                                <option value={SoilType[key]} key={index}>
                                  {SoilType[key]}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                */}
                        </Col>
                        <Col sm={6}>
                          <SelectFieldBs
                            className="mb-3"
                            label="Light requirement"
                            name="light_requirement"
                            onChange={handleChange}
                            selectionObject={LightRequirement}
                          />
                          {/*
                          <Form.Group>
                            <Form.Label>Light requirement</Form.Label>
                            <Form.Select
                              name="light_requirement"
                              onChange={handleChange}
                            >
                              {Object.keys(LightRequirement).map(
                                (key, index) => (
                                  <option
                                    value={LightRequirement[key]}
                                    key={index}
                                  >
                                    {LightRequirement[key]}
                                  </option>
                                )
                              )}
                            </Form.Select>
                          </Form.Group>
                */}
                        </Col>
                      </Row>
                      <TextAreaFieldBs
                        className="mb-3"
                        label="Important growing tips (optional)"
                        rows={3}
                        name="growing_tips"
                        onChange={handleChange}
                        error={formErrors.growing_tips}
                      />
                      {/*
                      <Form.Group>
                        <Form.Label>
                          Important growing tips (optional)
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="growing_tips"
                          onChange={handleChange}
                        />
                      </Form.Group>
                */}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </>
            )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            clearFormData();
            toggleCreateItemPostModal();
          }}
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
      </Modal.Footer>
    </Modal>
  );
}
