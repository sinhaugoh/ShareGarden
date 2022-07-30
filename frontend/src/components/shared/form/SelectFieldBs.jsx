import { Form } from "react-bootstrap";

export default function SelectFieldBs({
  label,
  name,
  onChange,
  className,
  selectionObject,
  defaultValue,
}) {
  return (
    <Form.Group className={className}>
      <Form.Label>{label}</Form.Label>
      <Form.Select name={name} onChange={onChange} defaultValue={defaultValue}>
        {Object.keys(selectionObject).map((key, index) => (
          <option value={selectionObject[key]} key={index}>
            {selectionObject[key]}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
}
