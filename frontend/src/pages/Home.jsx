import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedOpportunities from "../components/FeaturedOpportunities";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

const API_URL = "http://localhost:5000";

function Home() {
  const [businesses, setBusinesses] = useState([]);
  const [businessLoading, setBusinessLoading] = useState(true);

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const response = await fetch(`${API_URL}/api/businesses`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load businesses");
        }

        const businessList = Array.isArray(data)
          ? data
          : data.businesses || [];

        setBusinesses(businessList.slice(0, 6));
      } catch (error) {
        console.error("Home businesses error:", error);
      } finally {
        setBusinessLoading(false);
      }
    };

    loadBusinesses();
  }, []);

  return (
    <>
      <Navbar />

      <Hero />

      <Categories />

      <FeaturedOpportunities />

      {/* =========================
          FEATURED BUSINESSES
      ========================= */}
      <section
        style={{
          padding: "80px 20px",
          background: "#f8fafc",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              marginBottom: "35px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span
                style={{
                  display: "inline-block",
                  padding: "7px 13px",
                  borderRadius: "999px",
                  background: "#dbeafe",
                  color: "#1d4ed8",
                  fontSize: "13px",
                  fontWeight: "700",
                  marginBottom: "12px",
                }}
              >
                🏢 MelaHub Directory
              </span>

              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(28px, 4vw, 40px)",
                  color: "#111827",
                }}
              >
                Discover Businesses
              </h2>

              <p
                style={{
                  margin: "10px 0 0",
                  color: "#64748b",
                  fontSize: "16px",
                }}
              >
                Explore businesses and services across Ethiopia.
              </p>
            </div>

            <a
              href="/businesses"
              style={{
                textDecoration: "none",
                padding: "12px 20px",
                borderRadius: "10px",
                background: "#2563eb",
                color: "white",
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              View All Businesses →
            </a>
          </div>

          {businessLoading ? (
            <div
              style={{
                textAlign: "center",
                padding: "50px 20px",
                background: "white",
                borderRadius: "18px",
                color: "#64748b",
              }}
            >
              Loading businesses...
            </div>
          ) : businesses.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "50px 20px",
                background: "white",
                borderRadius: "18px",
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ fontSize: "45px" }}>🏢</div>

              <h3
                style={{
                  margin: "12px 0 8px",
                  color: "#111827",
                }}
              >
                Businesses are coming soon
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                }}
              >
                New businesses will appear here once they are added.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "22px",
              }}
            >
              {businesses.map((business) => (
                <article
                  key={business._id || business.id}
                  style={{
                    background: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "18px",
                    overflow: "hidden",
                    boxShadow:
                      "0 8px 25px rgba(15, 23, 42, 0.06)",
                  }}
                >
                  <div
                    style={{
                      height: "170px",
                      background: "#e2e8f0",
                      overflow: "hidden",
                    }}
                  >
                    {business.image ? (
                      <img
                        src={business.image}
                        alt={business.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "55px",
                        }}
                      >
                        🏢
                      </div>
                    )}
                  </div>

                  <div style={{ padding: "20px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "5px 9px",
                        borderRadius: "999px",
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        fontSize: "11px",
                        fontWeight: "700",
                        marginBottom: "10px",
                      }}
                    >
                      {business.category || "Business"}
                    </span>

                    <h3
                      style={{
                        margin: "0 0 8px",
                        fontSize: "20px",
                        color: "#111827",
                      }}
                    >
                      {business.name}
                    </h3>

                    {business.location && (
                      <p
                        style={{
                          margin: "0 0 10px",
                          color: "#64748b",
                          fontSize: "14px",
                        }}
                      >
                        📍 {business.location}
                      </p>
                    )}

                    {business.description && (
                      <p
                        style={{
                          margin: 0,
                          color: "#64748b",
                          fontSize: "14px",
                          lineHeight: "1.6",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {business.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <HowItWorks />

      <CTA />

      <Footer />
    </>
  );
}

export default Home;