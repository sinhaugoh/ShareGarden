import { Form } from "react-bootstrap";

export default function TextFieldBs({
  className,
  label,
  error,
  onChange,
  placeholder,
  name,
  innerRef,
  defaultValue,
  disabled,
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
        ref={innerRef}
        defaultValue={defaultValue}
        disabled={disabled}
      />
      {error && <Form.Text className="invalid-feedback">{error}</Form.Text>}
    </Form.Group>
  );
}
