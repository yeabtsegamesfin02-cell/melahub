import { useNavigate } from "react-router-dom";

const categories = [
  {
    icon: "💼",
    title: "Jobs",
    description: "Find jobs and career opportunities.",
    search: "Jobs & Careers",
  },
  {
    icon: "🛠️",
    title: "Services",
    description: "Find people offering useful services.",
    search: "Local Services",
  },
  {
    icon: "🎓",
    title: "Education",
    description: "Find scholarships, courses and training.",
    search: "Scholarships",
  },
  {
    icon: "🚀",
    title: "Internships",
    description: "Build experience with real opportunities.",
    search: "Internships",
  },
  {
    icon: "💰",
    title: "Grants",
    description: "Discover funding and startup opportunities.",
    search: "Grants & Funding",
  },
  {
    icon: "🌱",
    title: "Agriculture",
    description: "Explore farming and agriculture opportunities.",
    search: "Agriculture & Farming",
  },
];

function Categories() {
  const navigate = useNavigate();

  const exploreCategory = (category) => {
    navigate(
      `/opportunities?category=${encodeURIComponent(category.search)}`
    );
  };

  return (
    <section className="categories" id="categories">
      <div className="section-container">

        <div className="section-heading">
          <span>EXPLORE MELAHUB</span>

          <h2>Everything You Need, In One Place</h2>

          <p>
            Explore different categories and discover opportunities
            that match what you are looking for.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <div
              className="category-card"
              key={category.title}
            >
              <div className="category-icon">
                {category.icon}
              </div>

              <h3>{category.title}</h3>

              <p>{category.description}</p>

              <button
                onClick={() => exploreCategory(category)}
              >
                Explore →
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Categories;