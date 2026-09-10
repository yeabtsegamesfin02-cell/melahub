import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";
import "./Dashboard.css";

const API_URL = "http://localhost:5000";
const SAVED_KEY = "melahubSavedOpportunities";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedLoading, setSavedLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("melahubToken") ||
        localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/applications`,
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

      setApplications(
        Array.isArray(data.applications)
          ? data.applications
          : []
      );
    } catch (err) {
      console.error(
        "Dashboard applications error:",
        err
      );

      setError(
        err.message ||
          "Unable to load your applications."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedOpportunities = async () => {
    try {
      setSavedLoading(true);

      const savedIds = JSON.parse(
        localStorage.getItem(SAVED_KEY) || "[]"
      );

      if (!Array.isArray(savedIds) || savedIds.length === 0) {
        setSavedOpportunities([]);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/opportunities`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load saved opportunities."
        );
      }

      const opportunities = Array.isArray(
        data.opportunities
      )
        ? data.opportunities
        : [];

      const saved = opportunities.filter((item) =>
        savedIds.includes(
          String(item._id || item.id)
        )
      );

      setSavedOpportunities(saved);
    } catch (err) {
      console.error(
        "Saved opportunities error:",
        err
      );

      setSavedOpportunities([]);
    } finally {
      setSavedLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchSavedOpportunities();
  }, []);

  const removeSaved = (id) => {
    const savedIds = JSON.parse(
      localStorage.getItem(SAVED_KEY) || "[]"
    );

    const updatedIds = savedIds.filter(
      (savedId) => savedId !== String(id)
    );

    localStorage.setItem(
      SAVED_KEY,
      JSON.stringify(updatedIds)
    );

    setSavedOpportunities((current) =>
      current.filter(
        (item) =>
          String(item._id || item.id) !==
          String(id)
      )
    );
  };

  const submittedCount = applications.length;

  const reviewCount = applications.filter(
    (app) => app.status === "Under Review"
  ).length;

  const acceptedCount = applications.filter(
    (app) => app.status === "Accepted"
  ).length;

  const rejectedCount = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

  const notifications = useMemo(() => {
    return applications
      .map((application) => {
        const status =
          application.status || "Submitted";

        let icon = "📝";
        let title = "Application submitted";
        let message =
          "Your application has been submitted successfully.";
        let type = "submitted";

        if (status === "Under Review") {
          icon = "🔎";
          title = "Application under review";
          message =
            "Your application is currently being reviewed.";
          type = "review";
        }

        if (status === "Accepted") {
          icon = "🎉";
          title = "Application accepted";
          message =
            "Congratulations! Your application was accepted.";
          type = "accepted";
        }

        if (status === "Rejected") {
          icon = "❌";
          title = "Application update";
          message =
            "Your application was not accepted this time. Keep going!";
          type = "rejected";
        }

        return {
          id: application._id,
          icon,
          title,
          message,
          type,
          opportunity:
            application.opportunity?.title ||
            "Opportunity",
          date: application.createdAt
            ? new Date(
                application.createdAt
              ).toLocaleDateString()
            : "Recently",
        };
      })
      .reverse();
  }, [applications]);

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

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">

          <div className="error-icon">!</div>

          <h2>
            Something went wrong
          </h2>

          <p>{error}</p>

          <button onClick={fetchApplications}>
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

        {loading && (
          <div className="dashboard-loading dashboard-loading-inline">

            <div className="loader"></div>

            <p>
              Updating your MelaHub space...
            </p>

          </div>
        )}

        {/* =========================
            HERO
        ========================== */}

        <section className="dashboard-hero">

          <div>

            <span className="eyebrow">
              YOUR MELAHUB SPACE
            </span>

            <h1>
              Your next opportunity
              <span> starts here.</span>
            </h1>

            <p>
              Track applications, save opportunities,
              and stay updated on your journey.
            </p>

          </div>

          <Link
            to="/opportunities"
            className="explore-button"
          >
            Explore Opportunities
            <span>→</span>
          </Link>

        </section>

        {/* =========================
            STATS
        ========================== */}

        <section className="stats-grid">

          <div className="stat-card primary">

            <div className="stat-top">
              <span>
                Applications
              </span>

              <div className="stat-icon">
                ↗
              </div>
            </div>

            <strong>
              {submittedCount}
            </strong>

            <p>
              Total applications
            </p>

          </div>

          <div className="stat-card">

            <div className="stat-top">
              <span>
                Under Review
              </span>

              <div className="stat-icon">
                ◷
              </div>
            </div>

            <strong>
              {reviewCount}
            </strong>

            <p>
              Waiting for response
            </p>

          </div>

          <div className="stat-card">

            <div className="stat-top">
              <span>
                Accepted
              </span>

              <div className="stat-icon">
                ✓
              </div>
            </div>

            <strong>
              {acceptedCount}
            </strong>

            <p>
              Successful applications
            </p>

          </div>

        </section>

        {/* =========================
            NOTIFICATIONS
        ========================== */}

        <section className="applications-section">

          <div className="section-heading">

            <div>

              <span className="eyebrow">
                STAY UPDATED
              </span>

              <h2>
                Notifications
              </h2>

            </div>

            {notifications.length > 0 && (
              <span className="application-count">
                {notifications.length} update
                {notifications.length !== 1
                  ? "s"
                  : ""}
              </span>
            )}

          </div>

          {loading ? (

            <div className="empty-state">

              <div className="empty-symbol">
                ◌
              </div>

              <h3>
                Checking your notifications...
              </h3>

            </div>

          ) : notifications.length === 0 ? (

            <div className="empty-state">

              <div className="empty-symbol">
                🔔
              </div>

              <h3>
                You're all caught up.
              </h3>

              <p>
                Your application updates will appear
                here when something changes.
              </p>

            </div>

          ) : (

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >

              {notifications.map(
                (notification) => (

                  <article
                    key={notification.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "18px",
                      borderRadius: "16px",
                      background: "#ffffff",
                      border: "1px solid #e5e7eb",
                    }}
                  >

                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        minWidth: "48px",
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          notification.type ===
                          "accepted"
                            ? "#dcfce7"
                            : notification.type ===
                              "rejected"
                            ? "#fee2e2"
                            : notification.type ===
                              "review"
                            ? "#fef3c7"
                            : "#dbeafe",
                        fontSize: "22px",
                      }}
                    >
                      {notification.icon}
                    </div>

                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >

                      <h3
                        style={{
                          margin: "0 0 5px",
                          color: "#111827",
                          fontSize: "16px",
                        }}
                      >
                        {notification.title}
                      </h3>

                      <p
                        style={{
                          margin: "0 0 5px",
                          color: "#64748b",
                          fontSize: "14px",
                        }}
                      >
                        {notification.message}
                      </p>

                      <span
                        style={{
                          color: "#94a3b8",
                          fontSize: "12px",
                        }}
                      >
                        {notification.opportunity}
                        {" • "}
                        {notification.date}
                      </span>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

        {/* =========================
            SAVED OPPORTUNITIES
        ========================== */}

        <section className="applications-section">

          <div className="section-heading">

            <div>

              <span className="eyebrow">
                YOUR SHORTLIST
              </span>

              <h2>
                Saved Opportunities
              </h2>

            </div>

            {savedOpportunities.length > 0 && (
              <span className="application-count">
                {savedOpportunities.length} saved
              </span>
            )}

          </div>

          {savedLoading ? (

            <div className="empty-state">

              <div className="empty-symbol">
                ◌
              </div>

              <h3>
                Loading your saved opportunities...
              </h3>

            </div>

          ) : savedOpportunities.length === 0 ? (

            <div className="empty-state">

              <div className="empty-symbol">
                ☆
              </div>

              <h3>
                Nothing saved yet.
              </h3>

              <p>
                Save interesting opportunities and
                they'll appear here.
              </p>

              <Link
                to="/opportunities"
                className="explore-button"
              >
                Discover Opportunities
                <span>→</span>
              </Link>

            </div>

          ) : (

            <div className="application-list">

              {savedOpportunities.map(
                (opportunity) => (

                  <article
                    className="application-card"
                    key={
                      opportunity._id ||
                      opportunity.id
                    }
                  >

                    <div className="application-main">

                      <div className="opportunity-mark">
                        {opportunity.title
                          ?.charAt(0)
                          ?.toUpperCase() || "M"}
                      </div>

                      <div className="application-info">

                        <span className="application-label">
                          SAVED OPPORTUNITY
                        </span>

                        <h3>
                          {opportunity.title}
                        </h3>

                        <div className="application-meta">

                          <span>
                            ◈{" "}
                            {opportunity.organization ||
                              "MelaHub"}
                          </span>

                          <span>
                            ⌖{" "}
                            {opportunity.location ||
                              "Ethiopia"}
                          </span>

                        </div>

                      </div>

                    </div>

                    <div
                      className="application-side"
                      style={{
                        gap: "10px",
                      }}
                    >

                      <Link
                        to={`/opportunities/${
                          opportunity._id ||
                          opportunity.id
                        }`}
                        className="view-opportunity"
                        style={{
                          padding: "10px 14px",
                          textDecoration: "none",
                        }}
                      >
                        View
                        <span>→</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          removeSaved(
                            opportunity._id ||
                              opportunity.id
                          )
                        }
                        style={{
                          border:
                            "1px solid #e2e8f0",
                          background: "#fff",
                          color: "#64748b",
                          padding: "9px 12px",
                          borderRadius: "10px",
                          cursor: "pointer",
                          fontWeight: "700",
                        }}
                      >
                        ☆ Remove
                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

        {/* =========================
            APPLICATIONS
        ========================== */}

        <section className="applications-section">

          <div className="section-heading">

            <div>

              <span className="eyebrow">
                YOUR ACTIVITY
              </span>

              <h2>
                My Applications
              </h2>

            </div>

            {applications.length > 0 && (
              <span className="application-count">
                {applications.length} total
              </span>
            )}

          </div>

          {!loading &&
          applications.length === 0 ? (

            <div className="empty-state">

              <div className="empty-symbol">
                ✦
              </div>

              <h3>
                Your journey starts with one application.
              </h3>

              <p>
                Find an opportunity that matches
                your skills and take the first step.
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

              {applications.map(
                (application) => (

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
                              ?.organization ||
                              "MelaHub"}
                          </span>

                          <span>
                            ⌖{" "}
                            {application.opportunity
                              ?.location ||
                              "Ethiopia"}
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

                        {application.status ||
                          "Submitted"}
                      </span>

                      <span className="applied-date">
                        Applied{" "}
                        {application.createdAt
                          ? new Date(
                              application.createdAt
                            ).toLocaleDateString()
                          : "Recently"}
                      </span>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>

        {rejectedCount > 0 && (
          <div
            style={{
              marginTop: "20px",
              padding: "16px 20px",
              borderRadius: "14px",
              background: "#fff7ed",
              color: "#9a3412",
              border: "1px solid #fed7aa",
              fontSize: "14px",
            }}
          >
            You currently have{" "}
            <strong>
              {rejectedCount}
            </strong>{" "}
            rejected application
            {rejectedCount !== 1 ? "s" : ""}.
            Keep going — there are more opportunities
            waiting for you.
          </div>
        )}

      </div>

    </div>
  );
};

export default Dashboard;