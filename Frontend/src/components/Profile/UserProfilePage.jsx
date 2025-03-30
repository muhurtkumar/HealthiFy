import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  Box,
  Typography,
  Grid,
  Container,
  Paper,
  Card,
  CardContent,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Import custom hook and components with descriptive names
import { useProfileForm } from "./ProfileFormManager";
import ProfileHeaderWithStatus from "./ProfileHeaderWithStatus";
import ProfileImageUploader from "./ProfileImageUploader";
import ProfilePersonalInfoForm from "./ProfilePersonalInfoForm";
import ProfileActionButtons from "./ProfileActionButtons";

const theme = createTheme();

const UserProfilePage = () => {
  // Get auth context data
  const { user, logout, updateUserProfile } = useContext(AuthContext);
  
  // Get all form state and handlers from our custom hook
  const {
    // State
    profileData, isEditMode, isUpdating, 
    selectedProfileImage, profileCompletion, 
    notificationState, showCompletionPrompt,
    
    // Event handlers
    handleFieldChange, handleProfileImageChange, handleProfileSubmit,
    closeNotification, closeCompletionPrompt,
    
    // Actions
    setIsEditMode
  } = useProfileForm(user, updateUserProfile);
  
  // If no user, show login message
  if (!user) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <Typography>Please login to view your profile.</Typography>
      </Box>
    );
  }

  // Header and notification props
  const headerProps = { 
    profileCompletion,
    notificationState,
    closeNotification, 
    showCompletionPrompt,
    closeCompletionPrompt,
    setIsEditMode
  };

  // Profile image section props
  const imageProps = { 
    profileData, 
    isEditMode, 
    selectedProfileImage, 
    handleProfileImageChange 
  };

  // Action button props
  const buttonProps = { 
    isEditMode, 
    isUpdating, 
    setIsEditMode, 
    logout 
  };

  // Personal info form props
  const formProps = { 
    profileData, 
    handleFieldChange, 
    isEditMode 
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Fullscreen loading overlay */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column',
          gap: 2
        }}
        open={isUpdating}
      >
        <CircularProgress color="inherit" size={60} />
        <Typography variant="h6">Updating your profile...</Typography>
      </Backdrop>

      <Container maxWidth="lg" className="py-6 md:py-8">
        <Paper 
          elevation={2}
          sx={{
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
          className="p-4 md:p-6 lg:p-8"
        >
          {/* Profile header with status indicators */}
          <ProfileHeaderWithStatus {...headerProps} />

          {/* Main profile form */}
          <Box component="form" onSubmit={handleProfileSubmit} className="mt-4">
            <Grid container spacing={4}>
              {/* Left column - Profile image */}
              <Grid item xs={12} md={4}>
                <ProfileImageUploader {...imageProps} />
              </Grid>

              {/* Right column - Profile information */}
              <Grid item xs={12} md={8}>
                <Card 
                  variant="outlined" 
                  sx={{
                    height: '100%',
                    borderRadius: '8px',
                    borderColor: '#e0e0e0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                  className="shadow-sm"
                >
                  <CardContent className="p-4 md:p-6">
                    {/* Combined header row with buttons and title */}
                    <Box className="flex justify-between items-center mb-4">
                      <Typography variant="h6" className="font-semibold text-gray-700">
                        Personal Information
                      </Typography>
                      <ProfileActionButtons {...buttonProps} />
                    </Box>

                    {/* Personal information form fields */}
                    <ProfilePersonalInfoForm {...formProps} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default UserProfilePage; 