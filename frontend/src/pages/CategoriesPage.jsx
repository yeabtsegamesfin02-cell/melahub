import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";

const categories = [
  {
    id: 1,
    icon: "💼",
    name: "Jobs",
    description: "Find jobs and career opportunities.",
    count: "250+",
  },
  {
    id: 2,
    icon: "🛠️",
    name: "Services",
    description: "Find people offering useful services.",
    count: "180+",
  },
  {
    id: 3,
    icon: "🏪",
    name: "Businesses",
    description: "Discover local businesses and shops.",
    count: "120+",
  },
  {
    id: 4,
    icon: "🎓",
    name: "Education",
    description: "Find courses and learning opportunities.",
    count: "90+",
  },
  {
    id: 5,
    icon: "🏠",
    name: "Housing",
    description: "Discover homes and rental opportunities.",
    count: "75+",
  },
  {
    id: 6,
    icon: "📦",
    name: "Marketplace",
    description: "Buy and sell products easily.",
    count: "300+",
  },
];

function CategoriesPage() {
  return (
    <main className="categories-page">

      <section className="categories-hero">
        <div className="section-container">

          <BackButton />

          <span className="section-label">
            EXPLORE MELAHUB
          </span>

          <h1>Explore Categories</h1>

          <p>
            Find exactly what you need across
            Ethiopia.
          </p>

        </div>
      </section>

      <section className="categories-list">

        <div className="section-container">

          <div className="category-grid">

            {categories.map((category) => (
              <div
                className="category-card"
                key={category.id}
              >

                <div className="category-icon">
                  {category.icon}
                </div>

                <h2>
                  {category.name}
                </h2>

                <p>
                  {category.description}
                </p>

                <div className="category-bottom">

                  <span>
                    {category.count}
                  </span>

                  <Link to="/opportunities">
                    Explore →
                  </Link>

                </div>

              </div>
            ))}

          </div>

        </div>

      </section>

    </main>
  );
}

export default CategoriesPage;