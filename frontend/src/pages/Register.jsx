import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formInputs, setFormInputs] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const { user, register } = useAuth();
  const navigate = useNavigate();

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
  };

  // show loading if user is already authenticated
  if (user) {
    //TODO: implement loading
    return <h1>loading</h1>;
  }

  return (
    <div className="d-flex vh-75 align-items-center">
      <div className="container px-0">
        <div className="row gx-5 justify-content-center">
          <div className="col-4 d-none d-xl-block my-auto">
            <img
              style={{ width: "350px", height: "300px" }}
              src="/static/gardeners.png"
              alt="gardeners"
            />
          </div>
          <div className="col col-md-8 col-lg-6 col-xl-4 px-5 py-4 card">
            <h3>
              Welcome to <span className="fs-1">ShareGarden!</span>
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="id_username">
                  Username
                </label>
                <input
                  className={`form-control ${
                    errors.username ? "is-invalid" : ""
                  }`}
                  type="text"
                  name="username"
                  autoFocus
                  autoCapitalize="none"
                  maxLength="150"
                  required
                  id="id_username"
                  onChange={handleChange}
                />
                {errors.username && (
                  <div className="invalid-feedback">{errors.username[0]}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="id_password">
                  Password
                </label>
                <input
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  type="password"
                  name="password"
                  required
                  id="id_password"
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password[0]}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="id_password2">
                  Password confirmation
                </label>
                <input
                  className="form-control"
                  type="password"
                  name="password2"
                  required
                  id="id_password2"
                  onChange={handleChange}
                />
              </div>

              <div className="d-grid gap-2 mb-3">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={isSubmitting ? true : false}
                >
                  {isSubmitting ? "loading..." : "Sign up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
