import { Accordion, Row, Col, Form, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import {
  Category,
  ItemType,
  WaterRequirement,
  SoilType,
  LightRequirement,
} from "../../constants";
import { useCreateItemPost } from "../../contexts/CreateItemPostContext";
import { MAXIMUM_POST_IMAGE_COUNT } from "../../constants";

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
  const [formInputs, setFormInputs] = useState(DEFAULT_STATE);

  async function handleSubmit(event) {
    event.preventDefault();
  }

  function handleChange(event) {
    setFormInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
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

  console.log("form input", formInputs);

  return (
    <Modal
      show={isOpenCreateItemPostModal}
      size="lg"
      backdrop="static"
      scrollable={true}
      keyboard={false}
      onHide={() => {
        // clear form inputs after the user close the modal
        setFormInputs(DEFAULT_STATE);

        toggleCreateItemPostModal();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Share resources</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col sm={6} className="mb-3">
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
            </Col>
            <Col sm={6} className="mb-3">
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
            </Col>
          </Row>
          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group>
                <Form.Label>Cover image</Form.Label>
                <Form.Control
                  name="cover_image"
                  type="file"
                  onChange={handleSingleImageUploadChange}
                  accept="image/png, image/jpeg"
                />
              </Form.Group>
            </Col>
            <Col sm={6} className="mb-3">
              <Form.Group>
                <Form.Label>Image(s)</Form.Label>
                <Form.Control
                  name="images[]"
                  type="file"
                  multiple
                  onChange={handleMultipleImagesUploadChange}
                  accept="image/png, image/jpeg"
                />
                <Form.Text>
                  Maximum of {MAXIMUM_POST_IMAGE_COUNT} images are allowed.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" name="title" onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description (optional)</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={3}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="100"
              defaultValue="1"
              step="1"
              name="quantity"
              onChange={handleChange}
            />
          </Form.Group>
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
          <Form.Group className="mb-3">
            <Form.Label>Pick up location</Form.Label>
            <Form.Control type="text" name="location" onChange={handleChange} />
          </Form.Group>

          {formInputs.category === Category.GIVEAWAY &&
            formInputs.item_type === ItemType.SEED_OR_PLANT && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Seed/plant characteristics</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Red in color. Spicy..."
                    name="pick_up_information"
                    onChange={handleChange}
                  />
                </Form.Group>
                <Row className="mb-3">
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label>Days to harvest (optional)</Form.Label>
                      <Form.Control
                        type="number"
                        step="1"
                        name="days_to_harvest"
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
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
                        </Col>
                        <Col sm={6}>
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
                        </Col>
                      </Row>
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
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </>
            )}
        </Form>
      </Modal.Body>
    </Modal>
  );
}
