import { createContext, useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [doctorStatus, setDoctorStatus] = useState(null);
  const [profileStatus, setProfileStatus] = useState({
    isComplete: true,
    percentage: 100
  });

  const location = useLocation();

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
        // Update doctor status if role is Doctor
        if (userData.role === "Doctor") {
          setDoctorStatus(userData.doctorProfile?.status || null);
        }
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

  // Update profile status whenever user data changes
  useEffect(() => {
    if (user) {
      setProfileStatus(checkProfileCompletion(user));
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const role = searchParams.get("role") || "Patient";
      const response = await fetch("http://localhost:8000/healthify/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
        credentials: "include",
      });

      if (response.ok) {
        const result = await response.json();
        // After successful login, fetch full profile
        await fetchUserProfile();
        return {
          success: true,
          user: result.user,
          redirect: result.redirect,
          message: result.message
        };
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
      setDoctorStatus(null);
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

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      profileStatus,
      doctorStatus,
      updateUserProfile 
    }}>
      {isAuthenticated === null ? null : children}
    </AuthContext.Provider>
  );
};
