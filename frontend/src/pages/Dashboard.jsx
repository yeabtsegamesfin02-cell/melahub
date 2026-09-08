import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import "./Dashboard.css";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token =
          localStorage.getItem("melahubToken") ||
          localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load applications."
          );
        }

        setApplications(data.applications || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const submittedCount = applications.length;

  const reviewCount = applications.filter(
    (app) => app.status === "Under Review"
  ).length;

  const acceptedCount = applications.filter(
    (app) => app.status === "Accepted"
  ).length;

  const getStatusClass = (status) => {
    switch (status) {
      case "Accepted":
        return "status accepted";
      case "Rejected":
        return "status rejected";
      case "Under Review":
        return "status review";
      default:
        return "status submitted";
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="loader"></div>
          <h2>Building your MelaHub space...</h2>
          <p>Loading your opportunities and applications.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          <div className="error-icon">!</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-shell">

        <BackButton />

        {/* HERO */}
        <section className="dashboard-hero">
          <div>
            <span className="eyebrow">YOUR MELAHUB SPACE</span>

            <h1>
              Your next opportunity
              <span> starts here.</span>
            </h1>

            <p>
              Track your applications, discover new possibilities,
              and keep moving forward.
            </p>
          </div>

          <Link to="/opportunities" className="explore-button">
            Explore Opportunities
            <span>→</span>
          </Link>
        </section>

        {/* STATS */}
        <section className="stats-grid">

          <div className="stat-card primary">
            <div className="stat-top">
              <span>Applications</span>
              <div className="stat-icon">↗</div>
            </div>

            <strong>{submittedCount}</strong>

            <p>Total applications</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Under Review</span>
              <div className="stat-icon">◷</div>
            </div>

            <strong>{reviewCount}</strong>

            <p>Waiting for response</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Accepted</span>
              <div className="stat-icon">✓</div>
            </div>

            <strong>{acceptedCount}</strong>

            <p>Successful applications</p>
          </div>

        </section>

        {/* APPLICATIONS */}
        <section className="applications-section">

          <div className="section-heading">
            <div>
              <span className="eyebrow">YOUR ACTIVITY</span>
              <h2>My Applications</h2>
            </div>

            {applications.length > 0 && (
              <span className="application-count">
                {applications.length} total
              </span>
            )}
          </div>

          {applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-symbol">✦</div>

              <h3>Your journey starts with one application.</h3>

              <p>
                Find an opportunity that matches your skills
                and take the first step.
              </p>

              <Link
                to="/opportunities"
                className="explore-button"
              >
                Find Opportunities
                <span>→</span>
              </Link>
            </div>
          ) : (
            <div className="application-list">

              {applications.map((application) => (
                <article
                  className="application-card"
                  key={application._id}
                >
                  <div className="application-main">

                    <div className="opportunity-mark">
                      {application.opportunity?.title
                        ?.charAt(0)
                        ?.toUpperCase() || "M"}
                    </div>

                    <div className="application-info">
                      <span className="application-label">
                        OPPORTUNITY
                      </span>

                      <h3>
                        {application.opportunity?.title ||
                          "Opportunity"}
                      </h3>

                      <div className="application-meta">
                        <span>
                          ◈{" "}
                          {application.opportunity
                            ?.organization || "MelaHub"}
                        </span>

                        <span>
                          ⌖{" "}
                          {application.opportunity
                            ?.location || "Ethiopia"}
                        </span>
                      </div>
                    </div>

                  </div>

                  <div className="application-side">

                    <span
                      className={getStatusClass(
                        application.status
                      )}
                    >
                      <i></i>
                      {application.status}
                    </span>

                    <span className="applied-date">
                      Applied{" "}
                      {new Date(
                        application.createdAt
                      ).toLocaleDateString()}
                    </span>

                  </div>
                </article>
              ))}

            </div>
          )}

        </section>

      </div>
    </div>
  );
};

export default Dashboard;