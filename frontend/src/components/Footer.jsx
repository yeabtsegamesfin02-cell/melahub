function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <a href="/" className="footer-logo">
            Mela<span>Hub</span>
          </a>

          <p>
            Connecting people, businesses, and opportunities
            across Ethiopia.
          </p>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <a href="#home">Home</a>
          <a href="#categories">Categories</a>
          <a href="#opportunities">Opportunities</a>
          <a href="#how-it-works">How It Works</a>
        </div>

        <div className="footer-column">
          <h3>Categories</h3>
          <a href="#categories">Jobs</a>
          <a href="#categories">Services</a>
          <a href="#categories">Businesses</a>
          <a href="#categories">Marketplace</a>
        </div>

        <div className="footer-column">
          <h3>For Businesses</h3>
          <a href="#opportunities">Post Opportunity</a>
          <a href="#opportunities">Find Talent</a>
          <a href="#opportunities">Promote Business</a>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 MelaHub. All rights reserved.</p>

        <div>
          <a href="/">Privacy</a>
          <a href="/">Terms</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;