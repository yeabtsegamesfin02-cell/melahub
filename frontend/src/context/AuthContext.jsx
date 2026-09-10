
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("melahubUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Failed to load saved user:", error);
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("melahubUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("melahubUser");
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const register = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("melahubToken");
    localStorage.removeItem("token");
    localStorage.removeItem("melahubUser");

    setUser(null);
  };

  const isLoggedIn =
    !!user &&
    !!localStorage.getItem("melahubToken");

  const isAdmin =
    !!user &&
    user.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoggedIn,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}