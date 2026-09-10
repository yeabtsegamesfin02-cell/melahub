import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import BackButton from "../components/BackButton";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await api.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      navigate("/login");
    } catch (requestError) {
      setError(requestError.message || "Registration failed.");
    }
  }

  return (
    <main className="signup-page">
      <BackButton />

      <div className="signup-card">

        <Link to="/" className="signup-logo">
          Mela<span>Hub</span>
        </Link>

        <div className="signup-header">
          <h1>Create your account</h1>

          <p>
            Join MelaHub and discover new opportunities.
          </p>
        </div>

        <form
          className="signup-form"
          onSubmit={handleSubmit}
        >

          {error && (
            <div className="signup-error">
              ⚠️ {error}
            </div>
          )}

          <div className="signup-group">
            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          </div>

          <div className="signup-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="signup-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <div className="signup-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />
          </div>

          <label className="terms">
            <input type="checkbox" required />

            <span>
              I agree to the MelaHub terms and conditions.
            </span>
          </label>

          <button
            type="submit"
            className="signup-submit"
          >
            Create Account →
          </button>

        </form>

        <div className="signup-login">
          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Login
          </Link>
        </div>

        <Link
          to="/"
          className="signup-back"
        >
          ← Back to MelaHub
        </Link>

      </div>

    </main>
  );
}

export default Signup;