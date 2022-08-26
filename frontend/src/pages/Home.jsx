import { Container, Button, Row, Col, Form } from "react-bootstrap";
import { useState, useRef } from "react";
import HomeItemList from "../components/home/HomeItemList";
import { Category, ItemType } from "../constants";

export default function Home() {
  const [query, setQuery] = useState(null);
  const [category, setCategory] = useState("All");
  const [itemType, setItemType] = useState("All");
  const searchFieldElement = useRef();

  function handleSearchOnClick() {
    if (searchFieldElement.current.value) {
      setQuery(searchFieldElement.current.value);
    } else {
      setQuery(null);
    }
  }

  function handleCategoryOnChange(event) {
    setCategory(event.target.value);
  }

  function handleItemTypeOnChange(event) {
    setItemType(event.target.value);
  }

  return (
    <Container className="mt-3">
      <h1 className="mb-3">Discover</h1>
      <Row className="mb-3 align-items-center">
        <Col md="6">
          <div className="d-flex ">
            <Form.Control
              type="search"
              placeholder="Tomato seeds..."
              aria-label="Search"
              className="me-2"
              ref={searchFieldElement}
            />
            <Button onClick={handleSearchOnClick}>Search</Button>
          </div>
        </Col>
        <Col className="d-flex align-items-center">
          <div className="me-1">Category</div>
          <Form.Select className="me-2" onChange={handleCategoryOnChange}>
            <option>All</option>
            {Object.keys(Category).map((key, index) => (
              <option value={Category[key]} key={index}>
                {Category[key]}
              </option>
            ))}
          </Form.Select>
          <div className="me-1">Item type</div>
          <Form.Select onChange={handleItemTypeOnChange}>
            <option>All</option>
            {Object.keys(ItemType).map((key, index) => (
              <option value={ItemType[key]} key={index}>
                {ItemType[key]}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <HomeItemList query={query} category={category} itemType={itemType} />
    </Container>
  );
}
