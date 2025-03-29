import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);

  // Function to fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:8000/healthify/auth/profile", {
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();

        const userWithAvatar = {
          ...userData,
          avatar:
            userData.profilePhoto && userData.profilePhoto.trim() !== ""
              ? userData.profilePhoto
              : userData.name?.charAt(0).toUpperCase(),
        };

        setIsAuthenticated(true);
        setUser(userWithAvatar);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:8000/healthify/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.ok) {
        // After successful login, fetch full profile
        await fetchUserProfile();
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, message: errorData.msg };
      }
    } catch (error) {
      return { success: false, message: "Network error" };
    }
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:8000/healthify/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsAuthenticated(false);
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, message: "Logout failed" };
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {isAuthenticated === null ? null : children}
    </AuthContext.Provider>
  );
};
