import { usePlacesWidget } from "react-google-autocomplete";
import { Form } from "react-bootstrap";

export default function LocationAutocompleteFieldBs({
  className,
  label,
  error,
  onChange,
  placeholder,
  name,
  apiKey,
}) {
  const { ref } = usePlacesWidget({
    apiKey: apiKey,
    onPlaceSelected: (place, inputRef, autocomplete) => {
      onChange(place.formatted_address);
    },
    options: {
      // reset the types so that all types of locations are returned
      types: [],
    },
  });

  return (
    <Form.Group className={className}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        className={error && "is-invalid"}
        type="text"
        name={name}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        ref={ref}
      />
      {error && <Form.Text className="invalid-feedback">{error}</Form.Text>}
    </Form.Group>
  );
}
