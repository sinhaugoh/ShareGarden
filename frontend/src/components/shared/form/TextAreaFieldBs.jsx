import { Form } from "react-bootstrap";

export default function TextAreaFieldBs({
  className,
  label,
  error,
  name,
  rows,
  placeholder,
  onChange,
  ref,
}) {
  return (
    <Form.Group className={className}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        className={error && "is-invalid"}
        as="textarea"
        name={name}
        rows={rows}
        placeholder={placeholder}
        onChange={onChange}
        ref={ref}
      />
      {error && <Form.Text className="invalid-feedback">{error}</Form.Text>}
    </Form.Group>
  );
}
