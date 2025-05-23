import { createContext, useState, useEffect, useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileStatus, setProfileStatus] = useState({
    isComplete: true,
    percentage: 100
  });

  // Calculate profile completion whenever user changes
  const checkProfileCompletion = (userData) => {
    if (!userData) return { isComplete: true, percentage: 100 };
    
    const requiredFields = [
      { name: 'name', value: userData.name },
      { name: 'phone', value: userData.phone },
      { name: 'gender', value: userData.gender },
      { name: 'address', value: userData.address },
      { name: 'city', value: userData.city },
      { name: 'dateOfBirth', value: userData.dateOfBirth }
    ];
    
    const completedFields = requiredFields.filter(field => 
      field.value && String(field.value).trim() !== ''
    );
    
    const percentage = Math.round((completedFields.length / requiredFields.length) * 100);
    
    return {
      percentage,
      isComplete: percentage === 100
    };
  };

  // Function to fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:8000/healthify/profile/user-profile", {
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();

        const userWithAvatar = {
          ...userData,
          avatar:
            userData.profilePhoto && userData.profilePhoto.trim() !== ""
              ? `http://localhost:8000${userData.profilePhoto}`
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Update profile status whenever user data changes
  useEffect(() => {
    if (user) {
      setProfileStatus(checkProfileCompletion(user));
    }
  }, [user]);

  const login = async (email, passwordOrKey, selectedRole) => {
    try {
      let endpoint = "http://localhost:8000/healthify/auth/login";
      let requestBody = { email, password: passwordOrKey, role: selectedRole };
      if (selectedRole === "Admin") {
        endpoint = "http://localhost:8000/healthify/auth/admin-login";
        requestBody = { email, securityKey: passwordOrKey };
      }
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user.role !== selectedRole) {
          setLoading(false);
          return { 
            success: false, 
            message: `You are not logged in as ${selectedRole}. Please select the correct role.` 
          };
        }
        // After successful login, fetch full profile
        await fetchUserProfile();
        return { success: true };
      } else {
        const errorData = await response.json();
        setLoading(false);
        return { success: false, message: errorData.msg };
      }
    } catch (error) {
      setLoading(false);
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

  const updateUserProfile = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
    // Profile status will update automatically through the useEffect
  };

  const contextValue = useMemo(() => ({
    isAuthenticated,
    user,
    login,
    logout,
    profileStatus,
    updateUserProfile,
    loading,
  }), [isAuthenticated, user, profileStatus, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
