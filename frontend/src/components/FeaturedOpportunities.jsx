import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import localOpportunities from "../data/opportunities";

function FeaturedOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/opportunities"
        );

        const data = await response.json();

        if (!response.ok) throw new Error("Opportunity API unavailable");

        setOpportunities((data.opportunities || []).slice(0, 6));
      } catch (error) {
        console.warn("Using local opportunity catalog:", error.message);
        setOpportunities(localOpportunities.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  return (
    <section className="featured" id="opportunities">
      <div className="section-container">

        <div className="featured-top">
          <div>
            <span className="section-label">
              🇪🇹 MELAHUB OPPORTUNITIES
            </span>

            <h2>
              Opportunities Made
              <span className="gradient-text"> For You</span>
            </h2>

            <p>
              Jobs, scholarships, training, grants, agriculture,
              internships and more — all in one place.
            </p>
          </div>

          <Link
            to="/opportunities"
            className="view-all-btn"
          >
            Explore All →
          </Link>
        </div>

        {loading ? (
          <div className="featured-loading">
            <div className="featured-loader"></div>
            <p>Finding opportunities for you...</p>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="featured-empty">
            <h3>No opportunities yet.</h3>
            <p>New opportunities will appear here.</p>
          </div>
        ) : (
          <div className="opportunity-grid">
            {opportunities.map((opportunity) => (
              <article
                className="opportunity-card"
                key={opportunity._id}
              >

                <div className="opportunity-header">
                  <div className="opportunity-icon">
                    {opportunity.title
                      ?.charAt(0)
                      ?.toUpperCase() || "M"}
                  </div>

                  <span className="opportunity-type">
                    {opportunity.category}
                  </span>
                </div>

                <div className="opportunity-category">
                  {opportunity.category}
                </div>

                <h3>{opportunity.title}</h3>

                <p className="opportunity-company">
                  {opportunity.organization || "MelaHub"}
                </p>

                <div className="opportunity-details">
                  <span>
                    📍 {opportunity.location || "Ethiopia"}
                  </span>

                  <span>
                    ⏳{" "}
                    {opportunity.deadline
                      ? new Date(
                          opportunity.deadline
                        ).toLocaleDateString()
                      : "Open deadline"}
                  </span>
                </div>

                <div className="opportunity-skills">
                  {(opportunity.skills || [])
                    .slice(0, 3)
                    .map((skill, index) => (
                      <span key={index}>
                        {skill}
                      </span>
                    ))}
                </div>

                <div className="smart-match">
                  <div className="match-info">
                    <span>
                      🧠 MelaHub Opportunity
                    </span>

                    <strong>LIVE</strong>
                  </div>

                  <div className="match-progress">
                    <div style={{ width: "100%" }} />
                  </div>
                </div>

                <div className="opportunity-footer">
                  <small>
                    ✦ Verified opportunity
                  </small>

                  <Link
                    to={`/opportunities/${opportunity._id}`}
                    className="details-btn"
                  >
                    View Details →
                  </Link>
                </div>

              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default FeaturedOpportunities;