import { Box, Avatar, IconButton, Input, Typography, CircularProgress } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useState } from "react";

// Profile image section with upload functionality
const ProfileImageUploader = ({ 
  profileData, 
  isEditMode, 
  selectedProfileImage, 
  handleProfileImageChange 
}) => {
  const [isImageUploading, setIsImageUploading] = useState(false);

  // Handle file selection with loading state
  const handleFileSelection = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIsImageUploading(true);
      // Call the parent handler
      handleProfileImageChange(e);
      // Reset uploading state after a short delay to show the loading effect
      setTimeout(() => setIsImageUploading(false), 800);
    }
  };

  // Get the correct image source for display
  const getProfileImageSource = () => {
    if (selectedProfileImage) {
      return profileData.profilePhoto; // Local object URL for preview
    }
    if (profileData.profilePhoto && profileData.profilePhoto.startsWith('/')) {
      return `http://localhost:8000${profileData.profilePhoto}`; // Server URL
    }
    return profileData.profilePhoto; // Default or empty
  };

  // Get the first letter of name for avatar fallback
  const getAvatarFallbackText = () => {
    return profileData.name ? profileData.name.charAt(0).toUpperCase() : "U";
  };

  return (
    <Box className="flex flex-col items-center">
      <Box className="relative">
        {/* Profile image/avatar */}
        <Avatar
          src={getProfileImageSource()}
          alt={profileData.name || "User"}
          className="w-40 h-40 bg-blue-100 text-blue-600 text-4xl"
          sx={{ width: 160, height: 160, fontSize: 64 }}
        >
          {getAvatarFallbackText()}
        </Avatar>
        
        {/* Image upload button - only shown in edit mode */}
        {isEditMode && (
          <label htmlFor="profile-photo-input">
            <Input
              id="profile-photo-input"
              type="file"
              className="hidden"
              sx={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileSelection}
              disabled={isImageUploading}
            />
            <IconButton
              color="primary"
              aria-label="upload profile picture"
              component="span"
              disabled={isImageUploading}
              className="absolute bottom-0 right-0 bg-blue-600 text-white hover:bg-blue-700"
              sx={{ 
                position: 'absolute', 
                bottom: 0, 
                right: 0,
                backgroundColor: '#2563eb', 
                color: 'white',
                '&:hover': {
                  backgroundColor: '#1d4ed8',
                }
              }}
            >
              {isImageUploading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <PhotoCameraIcon />
              )}
            </IconButton>
          </label>
        )}
      </Box>

      {/* Profile basics display */}
      <Box className="text-center mt-4">
        <Typography variant="h6" className="font-semibold">
          {profileData.name || "New User"}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {profileData.role || "User"}
        </Typography>
        <Typography variant="body2" color="textSecondary" className="mt-1 mb-6">
          {profileData.email || ""}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfileImageUploader; 