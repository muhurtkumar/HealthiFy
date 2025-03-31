import { useState, useEffect, useMemo } from 'react';

// Field definitions for profile form
export const profileFieldDefinitions = {
  personalInfo: [
    { name: "name", label: "Full Name" },
    { name: "email", label: "Email Address", disabled: true },
    { name: "phone", label: "Phone Number", xs: 12, sm: 6 },
    {
      name: "gender", label: "Gender", xs: 12, sm: 6,
      options: [
        { value: "", label: "" },
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" }
      ]
    },
    { name: "address", label: "Address", multiline: true, rows: 2 },
    { name: "city", label: "City", xs: 12, sm: 6 },
    { name: "state", label: "State/Province", xs: 12, sm: 6 },
    {
      name: "bloodGroup", label: "Blood Group", xs: 12, sm: 6,
      options: [
        { value: "", label: "" },
        { value: "A+", label: "A+" }, { value: "A-", label: "A-" },
        { value: "B+", label: "B+" }, { value: "B-", label: "B-" },
        { value: "AB+", label: "AB+" }, { value: "AB-", label: "AB-" },
        { value: "O+", label: "O+" }, { value: "O-", label: "O-" }
      ]
    },
    { name: "dateOfBirth", label: "Date of Birth", xs: 12, sm: 6, type: "date" }
  ],
  requiredFields: [
    { name: 'name', label: 'Full Name' },
    { name: 'phone', label: 'Phone Number' },
    { name: 'gender', label: 'Gender' },
    { name: 'address', label: 'Address' },
    { name: 'city', label: 'City' },
    { name: 'dateOfBirth', label: 'Date of Birth' }
  ]
};

// Custom hook to manage all profile form state and operations
export const useProfileForm = (user, updateUserProfile) => {
  // Initial empty profile state
  const emptyProfileData = useMemo(() => ({
    name: "", email: "", role: "", profilePhoto: "",
    city: "", state: "", gender: "", address: "", phone: "",
    dateOfBirth: "", bloodGroup: "",
  }), []);
  
  const [profileData, setProfileData] = useState(emptyProfileData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notificationState, setNotificationState] = useState({ open: false, message: "", severity: "success" });
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setProfileData({
        ...emptyProfileData,
        ...user,
        role: user.role || "Patient",
      });
    }
  }, [user, emptyProfileData]);

  // Handle field changes
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // Handle profile image selection
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setNotificationState({
          open: true,
          message: "Only JPG, PNG, and WebP image formats are allowed",
          severity: "error"
        });
        e.target.value = null;
        return;
      }
      
      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setNotificationState({
          open: true,
          message: "Image size must be less than 5MB",
          severity: "error"
        });
        e.target.value = null;
        return;
      }
      
      setSelectedProfileImage(file);
      setProfileData({
        ...profileData,
        profilePhoto: URL.createObjectURL(file),
      });
    }
  };

  // API call to update profile
  const submitProfileUpdate = async (profileFormData) => {
    const formData = new FormData();
    
    // Add all fields except profilePhoto
    Object.keys(profileFormData).forEach(key => {
      if (key !== 'profilePhoto') {
        formData.append(key, profileFormData[key]);
      }
    });
    
    // Add profile photo if selected
    if (selectedProfileImage) {
      formData.append('profilePhoto', selectedProfileImage);
    }
    
    try {
      const response = await fetch("http://localhost:8000/healthify/profile/update-profile", {
        method: "PUT",
        credentials: "include",
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to update profile");
      }
      
      return await response.json();
    } catch (error) {
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error("Network error. Please check your connection.");
      }
      throw error;
    }
  };

  // Form submission handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      // Update profile
      const result = await submitProfileUpdate(profileData);
      
      if (result.user) {
        // Process the profile photo URL for navbar display
        const updatedUserData = {
          ...result.user,
          // Create avatar property for navbar display
          avatar: result.user.profilePhoto 
            ? `http://localhost:8000${result.user.profilePhoto}`
            : result.user.name?.charAt(0).toUpperCase()
        };
        
        // Update the user context (which updates navbar)
        updateUserProfile(updatedUserData);
      }
      
      setSelectedProfileImage(null);
      setNotificationState({
        open: true,
        message: "Profile updated successfully",
        severity: "success"
      });
      setIsEditMode(false);
    } catch (error) {
      setNotificationState({
        open: true,
        message: error.message || "Failed to update profile. Please try again.",
        severity: "error"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Profile completion calculation
  const profileCompletion = useMemo(() => {
    const completedFields = profileFieldDefinitions.requiredFields.filter(field => 
      profileData[field.name] && profileData[field.name].toString().trim() !== ''
    );
    
    const percentage = Math.round((completedFields.length / profileFieldDefinitions.requiredFields.length) * 100);
    
    return {
      percentage,
      incompleteFields: profileFieldDefinitions.requiredFields.filter(field => 
        !profileData[field.name] || profileData[field.name].toString().trim() === ''
      ),
      isComplete: percentage === 100
    };
  }, [profileData]);

  // Utility functions
  const closeNotification = () => setNotificationState({ ...notificationState, open: false });
  const closeCompletionPrompt = () => setShowCompletionPrompt(false);

  // Check profile completion on initial load
  useEffect(() => {
    if (user && !profileCompletion.isComplete) {
      const timer = setTimeout(() => {
        setShowCompletionPrompt(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [user, profileCompletion.isComplete]);

  return {
    // State
    profileData,
    isEditMode,
    isUpdating,
    notificationState,
    showCompletionPrompt,
    selectedProfileImage,
    profileCompletion,
    
    // Handlers
    handleFieldChange,
    handleProfileImageChange,
    handleProfileSubmit,
    closeNotification,
    closeCompletionPrompt,
    
    // Setters
    setIsEditMode
  };
}; 