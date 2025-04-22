import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { LayoutContext } from "../../context/LayoutContext";
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
import { useProfileForm } from "./ProfileFormManager";
import ProfileHeaderWithStatus from "./ProfileHeaderWithStatus";
import ProfileImageUploader from "./ProfileImageUploader";
import ProfilePersonalInfoForm from "./ProfilePersonalInfoForm";
import ProfileActionButtons from "./ProfileActionButtons";

const theme = createTheme();

const UserProfilePage = () => {
  const { user, logout, updateUserProfile } = useContext(AuthContext);
  const { getContentMargin, isMobile, isTablet, isDesktop } = useContext(LayoutContext);

  const {
    profileData,
    isEditMode,
    isUpdating,
    selectedProfileImage,
    profileCompletion,
    notificationState,
    showCompletionPrompt,
    handleFieldChange,
    handleProfileImageChange,
    handleProfileSubmit,
    closeNotification,
    closeCompletionPrompt,
    setIsEditMode,
  } = useProfileForm(user, updateUserProfile);

  if (!user) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <Typography>Please login to view your profile.</Typography>
      </Box>
    );
  }

  const spacing = isMobile ? 2 : isTablet ? 3 : 4;
  const padding = isMobile ? 2 : 3;

  return (
    <ThemeProvider theme={theme}>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
          gap: 2,
        }}
        open={isUpdating}
      >
        <CircularProgress color="inherit" size={60} />
        <Typography variant="h6">Updating your profile...</Typography>
      </Backdrop>

      <Box
        sx={{
          ...getContentMargin(user?.role),
          transition: "margin-left 0.3s ease",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            px: padding,
            py: isMobile ? 3 : 4,
          }}
        >
          <Paper
            elevation={isMobile ? 0 : 2}
            sx={{
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: isMobile ? "none" : "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <ProfileHeaderWithStatus
              profileCompletion={profileCompletion}
              notificationState={notificationState}
              closeNotification={closeNotification}
              showCompletionPrompt={showCompletionPrompt}
              closeCompletionPrompt={closeCompletionPrompt}
              setIsEditMode={setIsEditMode}
            />

            <Box component="form" onSubmit={handleProfileSubmit}>
              <Grid container spacing={spacing}>
                <Grid item xs={12} md={4}>
                  <ProfileImageUploader
                    profileData={profileData}
                    isEditMode={isEditMode}
                    selectedProfileImage={selectedProfileImage}
                    handleProfileImageChange={handleProfileImageChange}
                    compact={isTablet || isMobile}
                  />
                </Grid>

                <Grid item xs={12} md={8}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: "100%",
                      borderRadius: "8px",
                      borderColor: "#e0e0e0",
                      boxShadow: isMobile
                        ? "none"
                        : "0 2px 8px rgba(0,0,0,0.04)",
                    }}
                  >
                    <CardContent sx={{ p: padding }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: isMobile ? "column" : "row",
                          justifyContent: "space-between",
                          alignItems: isMobile ? "flex-start" : "center",
                          mb: 3,
                          gap: isMobile ? 2 : 0,
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Personal Information
                        </Typography>
                        <ProfileActionButtons
                          isEditMode={isEditMode}
                          isUpdating={isUpdating}
                          setIsEditMode={setIsEditMode}
                          logout={logout}
                          compact={isMobile}
                        />
                      </Box>

                      <ProfilePersonalInfoForm
                        profileData={profileData}
                        handleFieldChange={handleFieldChange}
                        isEditMode={isEditMode}
                        compact={isMobile || isTablet}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default UserProfilePage;
