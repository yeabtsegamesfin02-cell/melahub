import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">

        <div className="hero-content">
          <div className="hero-badge">
            🇪🇹 Built for Ethiopia's Future
          </div>

          <h1>
            Find Your
            <span> Next Opportunity.</span>
          </h1>

          <p>
            MelaHub connects Ethiopian talent with jobs, services,
            businesses and opportunities — intelligently matched to
            your skills and goals.
          </p>

          <div className="hero-buttons">
            <Link to="/opportunities" className="hero-primary">
              Explore Opportunities →
            </Link>

            <Link to="/signup" className="hero-secondary">
              Build My Profile
            </Link>
          </div>

          <div className="hero-trust">
            <div>
              <strong>Smart</strong>
              <span>Matching</span>
            </div>

            <div>
              <strong>Secure</strong>
              <span>Platform</span>
            </div>

            <div>
              <strong>Made</strong>
              <span>for Ethiopia 🇪🇹</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="match-card">
            <div className="match-top">
              <span>✨ Smart Match</span>
              <strong>92%</strong>
            </div>

            <h3>Frontend Developer</h3>
            <p>MelaTech • Addis Ababa</p>

            <div className="match-skills">
              <span>React ✓</span>
              <span>JavaScript ✓</span>
              <span>CSS ✓</span>
            </div>

            <div className="match-bar">
              <div></div>
            </div>

            <small>
              You match 4 of 5 requirements
            </small>
          </div>

          <div className="floating-card floating-one">
            🎯 <span>Opportunity Found</span>
          </div>

          <div className="floating-card floating-two">
            🔐 <span>Secure Profile</span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;