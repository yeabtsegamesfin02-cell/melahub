import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Opportunities from "./pages/Opportunities";
import CategoriesPage from "./pages/CategoriesPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import OpportunityDetails from "./pages/OpportunityDetails";
import Admin from "./pages/Admin";
import Businesses from "./pages/Businesses";
import MyBusiness from "./pages/MyBusiness";

function ThemeSync() {
  useEffect(() => {
    const darkMode = localStorage.getItem("melahubDarkMode") === "true";
    document.body.classList.toggle("dark-mode", darkMode);
  }, []);

  return null;
}

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AdminRoute({ children }) {
  const { isLoggedIn, isAdmin } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* =========================
          PUBLIC PAGES
      ========================= */}
      <Route path="/" element={<Home />} />

      <Route
        path="/opportunities"
        element={<Opportunities />}
      />

      <Route
        path="/opportunities/:id"
        element={<OpportunityDetails />}
      />

      <Route
        path="/categories"
        element={<CategoriesPage />}
      />

      <Route
        path="/businesses"
        element={<Businesses />}
      />

      {/* =========================
          AUTH PAGES
      ========================= */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      {/* =========================
          USER PAGES
      ========================= */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-business"
        element={
          <ProtectedRoute>
            <MyBusiness />
          </ProtectedRoute>
        }
      />

      {/* =========================
          ADMIN PAGE
      ========================= */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />

      {/* =========================
          FALLBACK
      ========================= */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeSync />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}