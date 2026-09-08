import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import localOpportunities from "../data/opportunities";
import "./Opportunities.css";

const Opportunities = () => {
  const [searchParams] = useSearchParams();

  const [opportunities, setOpportunities] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    () => searchParams.get("category") || "All"
  );
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOpportunities();
  }, []);

  async function fetchOpportunities() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/opportunities"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not load opportunities."
        );
      }

      setOpportunities(data.opportunities?.length ? data.opportunities : localOpportunities);
    } catch {
      setError("");
      setOpportunities(localOpportunities);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const unique = [
      ...new Set(
        opportunities
          .map((item) => item.category)
          .filter(Boolean)
      ),
    ];

    return ["All", ...unique];
  }, [opportunities]);

  const filteredOpportunities = useMemo(() => {
    let result = [...opportunities];

    if (search.trim()) {
      const query = search.toLowerCase();

      result = result.filter((item) =>
        [
          item.title,
          item.description,
          item.category,
          item.organization,
          item.location,
          ...(item.skills || []),
          ...(item.interests || []),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }

    if (category !== "All") {
      result = result.filter(
        (item) => item.category === category
      );
    }

    if (sort === "latest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    if (sort === "deadline") {
      result.sort(
        (a, b) =>
          new Date(a.deadline || "9999-12-31") -
          new Date(b.deadline || "9999-12-31")
      );
    }

    if (sort === "title") {
      result.sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      );
    }

    return result;
  }, [opportunities, search, category, sort]);

  const getInitial = (title) =>
    title?.charAt(0)?.toUpperCase() || "M";

  const getDeadlineText = (deadline) => {
    if (!deadline) return "Open deadline";

    return `Deadline ${new Date(
      deadline
    ).toLocaleDateString()}`;
  };

  if (loading) {
    return (
      <div className="opportunities-page">
        <div className="opportunities-loading">
          <div className="opportunities-loader"></div>
          <h2>Finding opportunities...</h2>
          <p>Loading the latest possibilities for you.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="opportunities-page">
        <div className="opportunities-error">
          <div className="error-mark">!</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>

          <button onClick={fetchOpportunities}>
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="opportunities-page">
      <div className="opportunities-container">

        <BackButton />

        <section className="opportunities-hero">
          <div className="hero-copy">
            <span className="eyebrow">
              MELAHUB OPPORTUNITY HUB
            </span>

            <h1>
              Find where your
              <span> potential fits.</span>
            </h1>

            <p>
              Discover jobs, scholarships, internships,
              training, grants and opportunities built for
              ambitious people in Ethiopia.
            </p>
          </div>

          <div className="hero-orbit">
            <div className="orbit-center">M</div>
            <span className="orbit-dot dot-one">✦</span>
            <span className="orbit-dot dot-two">↗</span>
            <span className="orbit-dot dot-three">●</span>
          </div>
        </section>

        <section className="discover-bar">
          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search opportunities, skills, organizations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button onClick={() => setSearch("")}>
                ×
              </button>
            )}
          </div>

          <div className="sort-box">
            <label>Sort</label>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="deadline">Deadline</option>
              <option value="title">A–Z</option>
            </select>
          </div>
        </section>

        <section className="category-scroll">
          {categories.map((item) => (
            <button
              key={item}
              className={
                category === item
                  ? "category-pill active"
                  : "category-pill"
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </section>

        <div className="results-header">
          <div>
            <span className="eyebrow">DISCOVER</span>

            <h2>
              Opportunities
              <span className="result-number">
                {filteredOpportunities.length}
              </span>
            </h2>
          </div>

          {search && (
            <p>
              Results for <strong>"{search}"</strong>
            </p>
          )}
        </div>

        {filteredOpportunities.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">⌕</div>

            <h3>Nothing found yet.</h3>

            <p>
              Try another search or explore a different
              category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="opportunity-grid">
            {filteredOpportunities.map((item) => (
              <article
                className="opportunity-card"
                key={item._id || item.id}
              >
                <div className="card-top">
                  <div className="opportunity-avatar">
                    {getInitial(item.title)}
                  </div>

                  <span className="category-label">
                    {item.category}
                  </span>
                </div>

                <h3>{item.title}</h3>

                <p className="organization">
                  {item.organization || "MelaHub"}
                </p>

                <p className="description">
                  {item.description ||
                    "Explore this opportunity and discover where it can take you."}
                </p>

                <div className="card-details">
                  <span>
                    ⌖ {item.location || "Ethiopia"}
                  </span>

                  <span>
                    ◷ {getDeadlineText(item.deadline)}
                  </span>
                </div>

                <div className="card-tags">
                  {(item.skills || [])
                    .slice(0, 3)
                    .map((skill, index) => (
                      <span key={index}>{skill}</span>
                    ))}
                </div>

                <Link
                  to={`/opportunities/${item._id || item.id}`}
                  className="view-opportunity"
                >
                  View Opportunity
                  <span>→</span>
                </Link>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Opportunities;