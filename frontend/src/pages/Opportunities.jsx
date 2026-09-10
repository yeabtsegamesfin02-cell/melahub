import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const getToken = () =>
  localStorage.getItem("melahubToken") ||
  localStorage.getItem("token");

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  const [loading, setLoading] = useState(true);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState("");

  // =====================================
  // LOAD OPPORTUNITIES
  // =====================================

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/opportunities`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load opportunities."
        );
      }

      setOpportunities(data.opportunities || []);
    } catch (err) {
      console.error(
        "Failed to load opportunities:",
        err
      );

      setError(
        err.message ||
          "Could not connect to MelaHub server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // LOAD SAVED OPPORTUNITIES
  // =====================================

  const loadSavedOpportunities = async () => {
    const token = getToken();

    if (!token) {
      setSavedOpportunities([]);
      return;
    }

    try {
      setSavedLoading(true);

      const response = await fetch(
        `${API_URL}/api/saved-opportunities`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        setSavedOpportunities([]);
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load saved opportunities."
        );
      }

      setSavedOpportunities(
        data.opportunities || []
      );
    } catch (err) {
      console.error(
        "Failed to load saved opportunities:",
        err
      );
    } finally {
      setSavedLoading(false);
    }
  };

  // =====================================
  // INITIAL LOAD
  // =====================================

  useEffect(() => {
    loadOpportunities();
    loadSavedOpportunities();
  }, []);

  // =====================================
  // SAVE / UNSAVE
  // =====================================

  const toggleSave = async (opportunity) => {
    const token = getToken();

    if (!token) {
      alert("Please login to save opportunities.");
      return;
    }

    const opportunityId = opportunity._id || opportunity.id;

    if (!opportunityId) {
      return;
    }

    const isSaved = savedOpportunities.some(
      (item) =>
        String(item._id || item.id) ===
        String(opportunityId)
    );

    try {
      setSavingId(opportunityId);

      const response = await fetch(
        `${API_URL}/api/saved-opportunities/${opportunityId}`,
        {
          method: isSaved ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        alert("Your session has expired. Please login again.");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update saved opportunity."
        );
      }

      if (isSaved) {
        setSavedOpportunities((current) =>
          current.filter(
            (item) =>
              String(item._id || item.id) !==
              String(opportunityId)
          )
        );
      } else {
        setSavedOpportunities((current) => [
          opportunity,
          ...current,
        ]);
      }
    } catch (err) {
      console.error(
        "Save opportunity error:",
        err
      );

      alert(
        err.message ||
          "Failed to update saved opportunity."
      );
    } finally {
      setSavingId(null);
    }
  };

  // =====================================
  // HELPERS
  // =====================================

  const isSaved = (opportunityId) => {
    return savedOpportunities.some(
      (item) =>
        String(item._id || item.id) ===
        String(opportunityId)
    );
  };

  const getOpportunityId = (opportunity) =>
    opportunity._id || opportunity.id;

  const getDeadline = (deadline) => {
    if (!deadline) {
      return "No deadline";
    }

    const date = new Date(deadline);

    if (Number.isNaN(date.getTime())) {
      return deadline;
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isDeadlinePassed = (deadline) => {
    if (!deadline) {
      return false;
    }

    const date = new Date(deadline);

    return (
      !Number.isNaN(date.getTime()) &&
      date < new Date()
    );
  };

  // =====================================
  // FILTER OPTIONS
  // =====================================

  const categories = useMemo(() => {
    const values = opportunities
      .map((item) => item.category)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [opportunities]);

  const locations = useMemo(() => {
    const values = opportunities
      .map((item) => item.location)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [opportunities]);

  // =====================================
  // FILTER + SEARCH + SORT
  // =====================================

  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = opportunities.filter((item) => {
      const title =
        item.title?.toLowerCase() || "";

      const description =
        item.description?.toLowerCase() || "";

      const organization =
        item.organization?.toLowerCase() || "";

      const itemCategory =
        item.category?.toLowerCase() || "";

      const itemLocation =
        item.location?.toLowerCase() || "";

      const matchesSearch =
        !query ||
        title.includes(query) ||
        description.includes(query) ||
        organization.includes(query) ||
        itemCategory.includes(query) ||
        itemLocation.includes(query);

      const matchesCategory =
        category === "All" ||
        item.category === category;

      const matchesLocation =
        location === "All" ||
        item.location === location;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation
      );
    });

    return [...result].sort((a, b) => {
      if (sortBy === "A-Z") {
        return (a.title || "").localeCompare(
          b.title || ""
        );
      }

      if (sortBy === "Deadline") {
        const dateA = a.deadline
          ? new Date(a.deadline).getTime()
          : Infinity;

        const dateB = b.deadline
          ? new Date(b.deadline).getTime()
          : Infinity;

        return dateA - dateB;
      }

      if (sortBy === "Category") {
        return (a.category || "").localeCompare(
          b.category || ""
        );
      }

      // Newest
      const dateA = a.createdAt
        ? new Date(a.createdAt).getTime()
        : 0;

      const dateB = b.createdAt
        ? new Date(b.createdAt).getTime()
        : 0;

      return dateB - dateA;
    });
  }, [
    opportunities,
    search,
    category,
    location,
    sortBy,
  ]);

  // =====================================
  // UI
  // =====================================

  return (
    <>
      <Navbar />

      <main className="opportunities-page">
        {/* HERO */}
        <section className="opportunities-hero">
          <div className="opportunities-hero-content">
            <span className="opportunities-eyebrow">
              🌍 Built for Ethiopia
            </span>

            <h1>
              Discover Your Next{" "}
              <span>Opportunity</span>
            </h1>

            <p>
              Find scholarships, internships,
              trainings, fellowships, and other
              opportunities built to help you move
              forward.
            </p>

            <div className="opportunities-search">
              <span>🔎</span>

              <input
                type="text"
                placeholder="Search opportunities..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </section>

        {/* CONTROLS */}
        <section className="opportunities-controls">
          <div className="opportunities-control-inner">
            <div className="opportunities-filter">
              <label>Category</label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >
                {categories.map((item) => (
                  <option
                    value={item}
                    key={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="opportunities-filter">
              <label>Location</label>

              <select
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
              >
                {locations.map((item) => (
                  <option
                    value={item}
                    key={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="opportunities-filter">
              <label>Sort by</label>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
              >
                <option value="Newest">
                  Newest
                </option>
                <option value="Deadline">
                  Deadline
                </option>
                <option value="A-Z">
                  A-Z
                </option>
                <option value="Category">
                  Category
                </option>
              </select>
            </div>

            <div className="opportunities-results">
              <strong>
                {filteredOpportunities.length}
              </strong>{" "}
              opportunities
            </div>

            <div className="opportunities-saved-count">
              ⭐ {savedLoading ? "..." : savedOpportunities.length}{" "}
              saved
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="opportunities-content">
          <div className="opportunities-container">
            {error && (
              <div className="opportunities-error">
                <div>⚠️</div>

                <h3>
                  Could not load opportunities
                </h3>

                <p>{error}</p>

                <button
                  type="button"
                  onClick={loadOpportunities}
                >
                  Try Again
                </button>
              </div>
            )}

            {loading && !error && (
              <div className="opportunities-loading">
                <div className="opportunities-spinner" />
                <p>
                  Loading opportunities...
                </p>
              </div>
            )}

            {!loading &&
              !error &&
              filteredOpportunities.length === 0 && (
                <div className="opportunities-empty">
                  <div className="opportunities-empty-icon">
                    🔍
                  </div>

                  <h3>
                    No opportunities found
                  </h3>

                  <p>
                    Try changing your search or
                    filters.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setCategory("All");
                      setLocation("All");
                      setSortBy("Newest");
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}

            {!loading &&
              !error &&
              filteredOpportunities.length > 0 && (
                <div className="opportunities-grid">
                  {filteredOpportunities.map(
                    (opportunity) => {
                      const id =
                        getOpportunityId(
                          opportunity
                        );

                      const saved =
                        isSaved(id);

                      const expired =
                        isDeadlinePassed(
                          opportunity.deadline
                        );

                      return (
                        <article
                          className="opportunity-card"
                          key={id}
                        >
                          <div className="opportunity-card-top">
                            <div className="opportunity-category">
                              {opportunity.category ||
                                "Opportunity"}
                            </div>

                            <button
                              type="button"
                              className={`opportunity-save-button ${
                                saved
                                  ? "saved"
                                  : ""
                              }`}
                              onClick={() =>
                                toggleSave(
                                  opportunity
                                )
                              }
                              disabled={
                                savingId === id
                              }
                              title={
                                saved
                                  ? "Remove from saved"
                                  : "Save opportunity"
                              }
                            >
                              {savingId === id
                                ? "..."
                                : saved
                                ? "★"
                                : "☆"}
                            </button>
                          </div>

                          <div className="opportunity-card-body">
                            <h2>
                              {opportunity.title}
                            </h2>

                            {opportunity.organization && (
                              <div className="opportunity-organization">
                                🏢{" "}
                                {
                                  opportunity.organization
                                }
                              </div>
                            )}

                            <p>
                              {opportunity.description ||
                                "Explore this opportunity and discover how it can help you build your future."}
                            </p>

                            <div className="opportunity-meta">
                              <span>
                                📍{" "}
                                {opportunity.location ||
                                  "Ethiopia"}
                              </span>

                              <span
                                className={
                                  expired
                                    ? "deadline-expired"
                                    : ""
                                }
                              >
                                ⏳{" "}
                                {getDeadline(
                                  opportunity.deadline
                                )}
                              </span>
                            </div>

                            {Array.isArray(
                              opportunity.skills
                            ) &&
                              opportunity.skills
                                .length > 0 && (
                                <div className="opportunity-tags">
                                  {opportunity.skills
                                    .slice(0, 4)
                                    .map(
                                      (skill) => (
                                        <span
                                          key={
                                            skill
                                          }
                                        >
                                          {skill}
                                        </span>
                                      )
                                    )}
                                </div>
                              )}
                          </div>

                          <div className="opportunity-card-footer">
                            <Link
                              to={`/opportunities/${id}`}
                              className="opportunity-view-button"
                            >
                              View Details →
                            </Link>

                            <button
                              type="button"
                              className={`opportunity-save-text ${
                                saved
                                  ? "saved"
                                  : ""
                              }`}
                              onClick={() =>
                                toggleSave(
                                  opportunity
                                )
                              }
                              disabled={
                                savingId === id
                              }
                            >
                              {saved
                                ? "Saved"
                                : "Save"}
                            </button>
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              )}
          </div>
        </section>
      </main>
    </>
  );
}

export default Opportunities;