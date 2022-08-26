import { Spinner } from "react-bootstrap";
export default function LoadingIndicator() {
  return (
    <div className="d-flex h-100 align-items-center justify-content-center mt-3">
      <Spinner animation="border" variant="success" />
    </div>
  );
}
