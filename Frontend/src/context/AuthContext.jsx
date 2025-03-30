import { createContext, useState, useEffect } from "react";
import { getApiUrl, API_ENDPOINTS, getImageUrl } from "../utils/apiConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
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
      const response = await fetch(getApiUrl(API_ENDPOINTS.PROFILE), {
        credentials: "include",
      });

      if (response.ok) {
        const userData = await response.json();

        const userWithAvatar = {
          ...userData,
          avatar:
            userData.profilePhoto && userData.profilePhoto.trim() !== ""
              ? getImageUrl(userData.profilePhoto)
              : userData.name?.charAt(0).toUpperCase(),
        };

        setIsAuthenticated(true);
        setUser(userWithAvatar);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      setIsAuthenticated(false);
      setUser(null);
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

  const login = async (email, password) => {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.LOGIN), {
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
      console.error("Login error:", error);
      return { success: false, message: "Network error: " + error.message };
    }
  };

  const logout = async () => {
    try {
      await fetch(getApiUrl(API_ENDPOINTS.LOGOUT), {
        method: "POST",
        credentials: "include",
      });
      setIsAuthenticated(false);
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, message: "Logout failed" };
    }
  };

  const updateUserProfile = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
    // Profile status will update automatically through the useEffect
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      profileStatus,
      updateUserProfile 
    }}>
      {isAuthenticated === null ? null : children}
    </AuthContext.Provider>
  );
};
