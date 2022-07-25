import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formInputs, setFormInputs] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { user, register } = useAuth();
  const navigate = useNavigate();

  console.log("user: " + user);
  // navigate to home page if the already authenticated
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (event) => {
    setFormInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const response = await register(formInputs);
    if (response.status === 400) {
      setErrors({});
      setErrors(response.data);
    }
    setIsSubmitting(false);
    console.log(response);
  };

  // show loading if user is already authenticated
  if (user) {
    //TODO: implement loading
    return <h1>loading</h1>;
  }

  return (
    <>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username
          <input
            type="text"
            name="username"
            autoFocus
            autoCapitalize="none"
            maxLength="150"
            required
            id="id_username"
            onChange={handleChange}
          />
        </label>
        <br />
        {errors.username && <p>{errors.username[0]}</p>}
        <label>
          Password
          <input
            type="password"
            name="password"
            required
            id="id_password"
            onChange={handleChange}
          />
        </label>
        <br />
        {errors.password && <p>{errors.password[0]}</p>}
        <label>
          Password confirmation
          <input
            type="password"
            name="password2"
            required
            id="id_password2"
            onChange={handleChange}
          />
        </label>

        <button type="submit">
          {isSubmitting ? "loading..." : "Register"}
        </button>
      </form>
    </>
  );
}
