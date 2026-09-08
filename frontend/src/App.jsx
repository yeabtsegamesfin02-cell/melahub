import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Opportunities from "./pages/Opportunities";
import CategoriesPage from "./pages/CategoriesPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import OpportunityDetails from "./pages/OpportunityDetails";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Opportunities */}
          <Route path="/opportunities" element={<Opportunities />} />

          {/* Categories */}
          <Route path="/categories" element={<CategoriesPage />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Protected Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Opportunity Details */}
          <Route
            path="/opportunities/:id"
            element={<OpportunityDetails />}
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;