import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import localOpportunities from "../data/opportunities";
import "./OpportunityDetails.css";

const API_URL = "http://localhost:5000";

const OpportunityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showApply, setShowApply] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // =====================================
  // LOAD OPPORTUNITY
  // =====================================

  useEffect(() => {
    const fetchOpportunity = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/opportunities/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load opportunity."
          );
        }

        const backendOpportunity =
          data.opportunity || data;

        setOpportunity(backendOpportunity);
      } catch (err) {
        console.error("Opportunity loading error:", err);

        // Keep local opportunities as fallback
        const localOpportunity = localOpportunities.find(
          (item) => String(item.id) === String(id)
        );

        if (localOpportunity) {
          setOpportunity(localOpportunity);
        } else {
          setError(
            err.message || "Unable to load this opportunity."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

  // =====================================
  // FORM CHANGE
  // =====================================

  const handleChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  // =====================================
  // OPEN APPLICATION
  // =====================================

  const handleOpenApply = () => {
    const token =
      localStorage.getItem("melahubToken") ||
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const savedUser = localStorage.getItem("melahubUser");

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);

        setFormData((current) => ({
          ...current,
          name: current.name || user.name || "",
          email: current.email || user.email || "",
        }));
      } catch (error) {
        console.error("Could not read saved user:", error);
      }
    }

    setSubmitMessage("");
    setSubmitError("");
    setShowApply(true);
  };

  // =====================================
  // SUBMIT APPLICATION
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setSubmitMessage("");
    setSubmitError("");

    try {
      const token =
        localStorage.getItem("melahubToken") ||
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!opportunity?._id) {
        throw new Error(
          "This opportunity cannot accept applications right now."
        );
      }

      const response = await fetch(
        `${API_URL}/api/applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            opportunityId: opportunity._id,
            name: formData.name.trim(),
            email: formData.email.trim(),
            message: formData.message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit application."
        );
      }

      setSubmitMessage(
        "Application submitted successfully! 🚀"
      );

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      console.error("Application error:", err);

      setSubmitError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="opportunity-loading">
        <div className="opportunity-loader"></div>
        <p>Finding your opportunity...</p>
      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (error || !opportunity) {
    return (
      <div className="opportunity-error">
        <div>!</div>

        <h2>Opportunity unavailable</h2>

        <p>
          {error || "We couldn't find this opportunity."}
        </p>

        <button
          onClick={() => navigate("/opportunities")}
        >
          ← Back to Opportunities
        </button>
      </div>
    );
  }

  // =====================================
  // DATA HELPERS
  // =====================================

  const skills = Array.isArray(opportunity.skills)
    ? opportunity.skills
    : [];

  const interests = Array.isArray(opportunity.interests)
    ? opportunity.interests
    : [];

  const deadline = opportunity.deadline
    ? new Date(opportunity.deadline).toLocaleDateString()
    : "No deadline";

  return (
    <div className="opportunity-page">

      <div className="opportunity-container">

        {/* BACK */}
        <BackButton fallback="/opportunities" />

        {/* HERO */}
        <section className="opportunity-hero">

          <div className="hero-symbol">
            {opportunity.title?.charAt(0)?.toUpperCase() || "M"}
          </div>

          <div className="hero-content">

            <span className="hero-category">
              {opportunity.category || "Opportunity"}
            </span>

            <h1>{opportunity.title}</h1>

            <p className="hero-organization">
              {opportunity.organization || "MelaHub"}
            </p>

            <div className="hero-meta">

              <span>
                ⌖ {opportunity.location || "Ethiopia"}
              </span>

              <span>
                ◷ {deadline}
              </span>

            </div>

          </div>

        </section>

        {/* MAIN */}
        <div className="opportunity-layout">

          <main className="opportunity-main">

            {/* ABOUT */}
            <section className="detail-card">

              <span className="section-label">
                ABOUT
              </span>

              <h2>What you'll be doing</h2>

              <p className="description">
                {opportunity.description ||
                  "No description provided for this opportunity."}
              </p>

            </section>

            {/* SKILLS */}
            <section className="detail-card">

              <span className="section-label">
                SKILLS & INTERESTS
              </span>

              <h2>What they're looking for</h2>

              <div className="tag-section">

                <h3>Skills</h3>

                <div className="tags">

                  {skills.length > 0 ? (
                    skills.map((skill, index) => (
                      <span
                        className="tag"
                        key={`${skill}-${index}`}
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="muted">
                      No specific skills listed.
                    </span>
                  )}

                </div>

              </div>

              <div className="tag-section">

                <h3>Interests</h3>

                <div className="tags">

                  {interests.length > 0 ? (
                    interests.map((interest, index) => (
                      <span
                        className="tag interest"
                        key={`${interest}-${index}`}
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <span className="muted">
                      No specific interests listed.
                    </span>
                  )}

                </div>

              </div>

            </section>

          </main>

          {/* APPLY CARD */}
          <aside className="apply-card">

            <span className="section-label">
              READY?
            </span>

            <h2>Take the next step.</h2>

            <p>
              Apply now and put your skills in motion.
            </p>

            <button
              className="apply-button"
              onClick={handleOpenApply}
            >
              Apply Now
              <span>↗</span>
            </button>

            <div className="apply-note">
              🔒 Your application is securely submitted.
            </div>

          </aside>

        </div>

      </div>

      {/* APPLICATION MODAL */}
      {showApply && (
        <div
          className="modal-overlay"
          onClick={() => {
            if (!submitting) {
              setShowApply(false);
            }
          }}
        >

          <div
            className="application-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              type="button"
              className="modal-close"
              onClick={() => {
                if (!submitting) {
                  setShowApply(false);
                }
              }}
              disabled={submitting}
            >
              ×
            </button>

            <span className="section-label">
              APPLICATION
            </span>

            <h2>Let's make it happen.</h2>

            <p className="modal-subtitle">
              Applying for{" "}
              <strong>{opportunity.title}</strong>
            </p>

            {/* SUCCESS */}
            {submitMessage && (
              <div className="success-message">
                ✓ {submitMessage}

                <button
                  type="button"
                  onClick={() => setShowApply(false)}
                >
                  Close
                </button>
              </div>
            )}

            {/* ERROR */}
            {submitError && (
              <div className="error-message">
                {submitError}
              </div>
            )}

            {/* FORM */}
            {!submitMessage && (
              <form onSubmit={handleSubmit}>

                <label>
                  Your Name

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    minLength={2}
                  />
                </label>

                <label>
                  Email Address

                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Why are you interested?

                  <textarea
                    name="message"
                    placeholder="Tell them why you're a great fit..."
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    required
                    minLength={10}
                  />
                </label>

                <button
                  className="submit-button"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Application 🚀"}
                </button>

              </form>
            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default OpportunityDetails;