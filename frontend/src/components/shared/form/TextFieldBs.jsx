import { Form } from "react-bootstrap";

export default function TextFieldBs({
  className,
  label,
  error,
  onChange,
  placeholder,
  name,
}) {
  return (
    <Form.Group className={className}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        className={error && "is-invalid"}
        type="text"
        name={name}
        placeholder={placeholder}
        onChange={onChange}
      />
      {error && <Form.Text className="invalid-feedback">{error}</Form.Text>}
    </Form.Group>
  );
}
