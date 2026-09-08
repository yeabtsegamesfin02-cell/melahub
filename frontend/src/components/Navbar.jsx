import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("melahubDarkMode") === "true"
  );

  const navigate = useNavigate();

  const token = localStorage.getItem("melahubToken");
  const savedUser = localStorage.getItem("melahubUser");
  const isLoggedIn = !!token || !!savedUser;

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("melahubDarkMode", darkMode);
  }, [darkMode]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode((current) => !current);
  };

  const handleLogout = () => {
    localStorage.removeItem("melahubToken");
    localStorage.removeItem("token");
    localStorage.removeItem("melahubUser");

    closeMenu();
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <Link to="/" className="logo" onClick={closeMenu}>
          Mela<span>Hub</span>
        </Link>

        {/* MOBILE MENU */}
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* NAVIGATION */}
        <nav className={menuOpen ? "nav-links active" : "nav-links"}>
          <NavLink to="/" end onClick={closeMenu}>
            🏠 Home
          </NavLink>

          <NavLink to="/opportunities" onClick={closeMenu}>
            🔎 Opportunities
          </NavLink>

          <NavLink to="/categories" onClick={closeMenu}>
            📚 Categories
          </NavLink>

          {isLoggedIn && (
            <>
              <NavLink to="/dashboard" onClick={closeMenu}>
                📊 Dashboard
              </NavLink>

              <NavLink to="/profile" onClick={closeMenu}>
                👤 Profile
              </NavLink>
            </>
          )}
        </nav>

        {/* ACTIONS */}
        <div className={menuOpen ? "nav-actions active" : "nav-actions"}>

          {/* DARK MODE — ALWAYS VISIBLE */}
          <button
            type="button"
            className="theme-btn"
            onClick={toggleDarkMode}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className="login-btn"
                onClick={closeMenu}
              >
                👤 Profile
              </Link>

              <button
                type="button"
                className="nav-cta"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="login-btn"
                onClick={closeMenu}
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="signup-btn"
                onClick={closeMenu}
              >
                Get Started
              </Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
}

export default Navbar;