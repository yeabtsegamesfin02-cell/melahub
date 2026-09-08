import { useState } from "react";
import { api } from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    education: "",
    interests: ""
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage("");

    try {
      await api.register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      setMessage("Account created successfully. You can now log in.");
    } catch (error) {
      setMessage(error.message || "Registration failed.");
    }
  }

  return (
    <main className="register-page">

      <div className="register-container">

        <div className="register-header">
          <span>JOIN MELAHUB</span>

          <h1>Create Your Student Account</h1>

          <p>
            Create your profile and start discovering opportunities
            that match your goals.
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="fullName">
              Full Name
            </label>

            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="form-group">
            <label htmlFor="education">
              Education Level
            </label>

            <select
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              required
            >
              <option value="">
                Select your education level
              </option>

              <option value="high-school">
                High School
              </option>

              <option value="university">
                University
              </option>

              <option value="college">
                College
              </option>

              <option value="graduate">
                Graduate
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="interests">
              Interests
            </label>

            <textarea
              id="interests"
              name="interests"
              placeholder="Example: Web development, business, engineering..."
              value={formData.interests}
              onChange={handleChange}
              rows="4"
            />
          </div>

          {message && (
            <div className="form-message">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="register-button"
          >
            Create Account →
          </button>

        </form>

      </div>

    </main>
  );
}

export default Register;