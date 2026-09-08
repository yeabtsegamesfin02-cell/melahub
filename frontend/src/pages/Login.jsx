import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setMessage("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setMessage("");

    try {
      const data = await api.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (!data || !data.token) {
        throw new Error("Login succeeded but no token was returned.");
      }

      localStorage.setItem("melahubToken", data.token);

      if (data.user) {
        localStorage.setItem(
          "melahubUser",
          JSON.stringify(data.user)
        );
      }

      if (rememberMe) {
        localStorage.setItem(
          "melahubRememberEmail",
          formData.email.trim()
        );
      } else {
        localStorage.removeItem("melahubRememberEmail");
      }

      login(data.user);

      setMessage("Login successful! Welcome back to MelaHub.");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        error?.message ||
          "Cannot connect to the MelaHub server. Make sure the backend is running."
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-showcase">
        <div className="showcase-overlay"></div>

        <div className="showcase-content">
          <Link to="/" className="auth-logo">
            Mela<span>Hub</span>
          </Link>

          <div className="showcase-text">
            <span className="showcase-badge">
              🚀 Your future starts here
            </span>

            <h1>
              Discover opportunities.
              <br />
              <span>Build your future.</span>
            </h1>

            <p>
              Find jobs, internships, scholarships and opportunities
              designed to help you grow.
            </p>

            <div className="showcase-points">
              <div className="showcase-point">
                <span>✓</span>
                <p>Discover new opportunities</p>
              </div>

              <div className="showcase-point">
                <span>✓</span>
                <p>Connect with organizations</p>
              </div>

              <div className="showcase-point">
                <span>✓</span>
                <p>Take the next step in your career</p>
              </div>
            </div>
          </div>

          <div className="showcase-footer">
            <span>© 2026 MelaHub</span>
            <span>Opportunity starts with one step.</span>
          </div>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-form-wrapper">

          <div className="mobile-logo">
            <Link to="/" className="auth-logo">
              Mela<span>Hub</span>
            </Link>
          </div>

          <div className="auth-heading">
            <span className="welcome-text">
              WELCOME BACK 👋
            </span>

            <h2>Sign in to MelaHub</h2>

            <p>
              Don't have an account?{" "}
              <Link to="/register">
                Create one
              </Link>
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">
              <label htmlFor="email">
                Email address
              </label>

              <div
                className={`input-wrapper ${
                  errors.email ? "input-error" : ""
                }`}
              >
                <span className="input-icon">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>

              {errors.email && (
                <span className="error-message">
                  ⚠ {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-link"
                  onClick={() =>
                    setMessage(
                      "Password reset will be connected to the backend later."
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>

              <div
                className={`input-wrapper ${
                  errors.password ? "input-error" : ""
                }`}
              >
                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>

              {errors.password && (
                <span className="error-message">
                  ⚠ {errors.password}
                </span>
              )}
            </div>

            <div className="remember-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />

                <span className="custom-checkbox"></span>

                Remember me
              </label>
            </div>

            {message && (
              <div className="auth-message">
                ✓ {message}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
            >
              Sign In
              <span>→</span>
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <div className="social-login">

            <button
              type="button"
              className="social-button"
              onClick={() =>
                setMessage(
                  "Google login will be connected to the backend later."
                )
              }
            >
              <span className="google-icon">
                G
              </span>

              Continue with Google
            </button>

            <button
              type="button"
              className="social-button"
              onClick={() =>
                setMessage(
                  "Facebook login will be connected later."
                )
              }
            >
              <span className="facebook-icon">
                f
              </span>

              Continue with Facebook
            </button>

          </div>

          <p className="security-note">
            🔐 Your information is securely handled by MelaHub.
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;
