import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import "./OpportunityDetails.css";

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

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/opportunities/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load opportunity."
          );
        }

        setOpportunity(data.opportunity || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
        setSubmitError("Please login first.");
        setSubmitting(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/applications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            opportunityId: opportunity._id,
            name: formData.name,
            email: formData.email,
            message: formData.message,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit application."
        );
      }

      setSubmitMessage("Application submitted successfully! 🚀");

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="opportunity-loading">
        <div className="opportunity-loader"></div>
        <p>Finding your opportunity...</p>
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="opportunity-error">
        <div>!</div>
        <h2>Opportunity unavailable</h2>
        <p>{error || "We couldn't find this opportunity."}</p>
        <button onClick={() => navigate("/opportunities")}>
          ← Back to Opportunities
        </button>
      </div>
    );
  }

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
              <span>⌖ {opportunity.location || "Ethiopia"}</span>

              <span>
                ◷{" "}
                {opportunity.deadline
                  ? new Date(
                      opportunity.deadline
                    ).toLocaleDateString()
                  : "No deadline"}
              </span>
            </div>

          </div>

        </section>

        {/* MAIN */}
        <div className="opportunity-layout">

          <main className="opportunity-main">

            <section className="detail-card">
              <span className="section-label">ABOUT</span>
              <h2>What you'll be doing</h2>

              <p className="description">
                {opportunity.description ||
                  "No description provided for this opportunity."}
              </p>
            </section>

            <section className="detail-card">

              <span className="section-label">
                SKILLS & INTERESTS
              </span>

              <h2>What they're looking for</h2>

              <div className="tag-section">

                <h3>Skills</h3>

                <div className="tags">
                  {(opportunity.skills || []).length > 0 ? (
                    opportunity.skills.map((skill, index) => (
                      <span className="tag" key={index}>
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
                  {(opportunity.interests || []).length > 0 ? (
                    opportunity.interests.map(
                      (interest, index) => (
                        <span className="tag interest" key={index}>
                          {interest}
                        </span>
                      )
                    )
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

            <span className="section-label">READY?</span>

            <h2>Take the next step.</h2>

            <p>
              Apply now and put your skills in motion.
            </p>

            <button
              className="apply-button"
              onClick={() => {
                setShowApply(true);
                setSubmitMessage("");
                setSubmitError("");
              }}
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
          onClick={() => setShowApply(false)}
        >
          <div
            className="application-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="modal-close"
              onClick={() => setShowApply(false)}
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

            {submitMessage && (
              <div className="success-message">
                ✓ {submitMessage}
              </div>
            )}

            {submitError && (
              <div className="error-message">
                {submitError}
              </div>
            )}

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