import { useEffect, useMemo, useState } from "react";
import BackButton from "../components/BackButton";
import "./Businesses.css";

const API_URL = "http://localhost:5000";

export default function Businesses() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/businesses`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load businesses.");
        }

        setBusinesses(
          Array.isArray(data) ? data : data.businesses || []
        );
      } catch (err) {
        console.error("Businesses error:", err);
        setError(err.message || "Unable to load businesses.");
      } finally {
        setLoading(false);
      }
    };

    loadBusinesses();
  }, []);

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        businesses
          .map((business) => business.category)
          .filter(Boolean)
      ),
    ];
  }, [businesses]);

  const filteredBusinesses = useMemo(() => {
    const term = search.trim().toLowerCase();

    return businesses.filter((business) => {
      const matchesSearch =
        !term ||
        [
          business.name,
          business.category,
          business.location,
          business.description,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(term)
          );

      const matchesCategory =
        category === "All" ||
        business.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [businesses, search, category]);

  return (
    <main className="businesses-page">
      <BackButton />

      <section className="businesses-hero">
        <div className="businesses-hero-content">
          <span className="businesses-badge">
            🇪🇹 MelaHub Business Directory
          </span>

          <h1>
            Discover Businesses
            <span> Across Ethiopia</span>
          </h1>

          <p>
            Find trusted businesses, services, and opportunities
            near you.
          </p>

          <div className="businesses-search">
            <span>🔍</span>

            <input
              type="text"
              placeholder="Search businesses, services, locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="businesses-content">
        <div className="businesses-toolbar">
          <div>
            <h2>Explore Businesses</h2>
            <p>
              {filteredBusinesses.length} business
              {filteredBusinesses.length !== 1 ? "es" : ""} found
            </p>
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="businesses-state">
            <div className="business-spinner"></div>
            <h3>Loading businesses...</h3>
            <p>Please wait a moment.</p>
          </div>
        )}

        {!loading && error && (
          <div className="businesses-state error-state">
            <div className="state-icon">⚠️</div>
            <h3>Couldn’t load businesses</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredBusinesses.length === 0 && (
          <div className="businesses-state">
            <div className="state-icon">🏢</div>
            <h3>No businesses found</h3>
            <p>
              Try another search or choose a different category.
            </p>
          </div>
        )}

        {!loading && !error && filteredBusinesses.length > 0 && (
          <div className="businesses-grid">
            {filteredBusinesses.map((business) => (
              <article
                className="business-card"
                key={business._id || business.id}
              >
                <div className="business-image">
                  {business.image ? (
                    <img
                      src={business.image}
                      alt={business.name}
                    />
                  ) : (
                    <div className="business-placeholder">
                      🏢
                    </div>
                  )}

                  <span className="business-category">
                    {business.category}
                  </span>
                </div>

                <div className="business-card-body">
                  <h3>{business.name}</h3>

                  {business.location && (
                    <div className="business-location">
                      📍 {business.location}
                    </div>
                  )}

                  {business.description && (
                    <p>{business.description}</p>
                  )}

                  <div className="business-actions">
                    {business.phone && (
                      <a href={`tel:${business.phone}`}>
                        📞 Call
                      </a>
                    )}

                    {business.email && (
                      <a href={`mailto:${business.email}`}>
                        ✉️ Email
                      </a>
                    )}

                    {business.website && (
                      <a
                        href={
                          business.website.startsWith("http")
                            ? business.website
                            : `https://${business.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        🌐 Website
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}