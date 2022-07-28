import { Container, Row, Col, Form, Modal } from "react-bootstrap";
import { Category, ItemType } from "../../constants";
import { useCreateItemPost } from "../../contexts/CreateItemPostContext";
export default function CreateItemPostFormModal() {
  const { isOpenCreateItemPostModal, toggleCreateItemPostModal } =
    useCreateItemPost();

  return (
    <Modal
      show={isOpenCreateItemPostModal}
      size="lg"
      backdrop="static"
      scrollable={true}
      keyboard={false}
      onHide={toggleCreateItemPostModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Create item post</Modal.Title>
      </Modal.Header>
      <Form></Form>
    </Modal>
  );
}
