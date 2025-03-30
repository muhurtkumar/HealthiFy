import { useState, useContext, useEffect, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  IconButton,
  Grid,
  Divider,
  Snackbar,
  Alert,
  Container,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  CircularProgress,
  LinearProgress,
  Chip,
  Tooltip,
  Badge
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LogoutIcon from "@mui/icons-material/Logout";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

const Profile = () => {
  const { user, logout, updateUserProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    profilePhoto: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    city: "",
    gender: "",
    address: "",
    phone: "",
    dateOfBirth: "",
    bloodGroup: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (user) {
      console.log('User profile data:', user);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "Patient",
        profilePhoto: user.profilePhoto || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        city: user.city || "",
        gender: user.gender || "",
        address: user.address || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
        bloodGroup: user.bloodGroup || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected file:', file.name, 'size:', file.size, 'type:', file.type);
      // Store the file for upload
      setSelectedFile(file);
      
      // Create a preview URL
      setFormData({
        ...formData,
        profilePhoto: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Password validation
      if (formData.newPassword && formData.newPassword.length < 8) {
        setAlert({
          open: true,
          message: "Password must be at least 8 characters long",
          severity: "error"
        });
        setLoading(false);
        return;
      }
      
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        setAlert({
          open: true,
          message: "Passwords don't match",
          severity: "error"
        });
        setLoading(false);
        return;
      }

      // Call the updateProfile function
      const result = await updateProfile(formData);
      
      console.log('Profile updated successfully:', result);
      
      // Update the context with new user data (sync local state with global state)
      if (result.user) {
        // Update user data in context
        updateUserProfile(result.user);
      }
      
      // Reset selected file state
      setSelectedFile(null);
      
      setAlert({
        open: true,
        message: "Profile updated successfully",
        severity: "success"
      });
      setIsEditing(false);
      setLoading(false);
    } catch (error) {
      console.error("Profile update error:", error);
      setAlert({
        open: true,
        message: error.message || "Failed to update profile. Please try again.",
        severity: "error"
      });
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleCloseCompletionPrompt = () => {
    setShowCompletionPrompt(false);
  };

  // For updating profile
  const updateProfile = async (profileData) => {
    try {
      // Use FormData instead of JSON for file uploads
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(profileData).forEach(key => {
        // Skip the profilePhoto field as we'll handle it separately
        if (key !== 'profilePhoto') {
          formData.append(key, profileData[key]);
        }
      });
      
      // Add the file if one was selected
      if (selectedFile) {
        console.log('Uploading file:', selectedFile.name);
        formData.append('profilePhoto', selectedFile);
      }
      
      console.log('Sending profile update request to server...');
      const response = await fetch("http://localhost:8000/healthify/auth/update-profile", {
        method: "PUT",
        // Don't set Content-Type header, browser will set it with the boundary
        credentials: "include",
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to update profile");
      }
      
      return await response.json();
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };

  // Calculate profile completion percentage
  const profileCompletion = useMemo(() => {
    const requiredFields = [
      { name: 'name', label: 'Full Name' },
      { name: 'phone', label: 'Phone Number' },
      { name: 'gender', label: 'Gender' },
      { name: 'address', label: 'Address' },
      { name: 'city', label: 'City' },
      { name: 'dateOfBirth', label: 'Date of Birth' }
    ];
    
    const completedFields = requiredFields.filter(field => 
      formData[field.name] && formData[field.name].toString().trim() !== ''
    );
    
    const percentage = Math.round((completedFields.length / requiredFields.length) * 100);
    
    return {
      percentage,
      incompleteFields: requiredFields.filter(field => 
        !formData[field.name] || formData[field.name].toString().trim() === ''
      ),
      isComplete: percentage === 100
    };
  }, [formData]);

  // Check profile completion on component mount
  useEffect(() => {
    if (user && !profileCompletion.isComplete) {
      // Show completion notification after a short delay
      const timer = setTimeout(() => {
        setShowCompletionPrompt(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [user, profileCompletion.isComplete]);

  if (!user) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <Typography>Please login to view your profile.</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" className="py-8">
        <Paper elevation={3} className="p-6 sm:p-8">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1" className="font-bold">
              Your <span className="text-blue-600">Profile</span>
            </Typography>
            
            {!profileCompletion.isComplete && (
              <Tooltip 
                title={
                  <Box>
                    <Typography variant="body2" fontWeight="bold" mb={1}>
                      Your profile is incomplete ({profileCompletion.percentage}%)
                    </Typography>
                    <Typography variant="body2" fontSize="12px">
                      Missing: {profileCompletion.incompleteFields.map(f => f.label).join(', ')}
                    </Typography>
                  </Box>
                }
                arrow
              >
                <Badge 
                  color="warning" 
                  variant="dot" 
                  sx={{ '& .MuiBadge-badge': { width: 10, height: 10 } }}
                >
                  <InfoOutlinedIcon color="action" fontSize="small" />
                </Badge>
              </Tooltip>
            )}
          </Box>

          <Snackbar 
            open={alert.open} 
            autoHideDuration={6000} 
            onClose={handleCloseAlert}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseAlert} severity={alert.severity} variant="filled">
              {alert.message}
            </Alert>
          </Snackbar>
          
          {/* Profile Completion Notification */}
          <Snackbar
            open={showCompletionPrompt}
            autoHideDuration={10000}
            onClose={handleCloseCompletionPrompt}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              severity="info" 
              onClose={handleCloseCompletionPrompt}
              action={
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={() => {
                    setIsEditing(true);
                    handleCloseCompletionPrompt();
                  }}
                >
                  COMPLETE
                </Button>
              }
            >
              Your profile is {profileCompletion.percentage}% complete. Add missing information to improve your experience.
            </Alert>
          </Snackbar>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Profile Photo Section */}
              <Grid item xs={12} md={4}>
                <Box className="flex flex-col items-center">
                  <Box className="relative">
                    <Avatar
                      src={selectedFile ? formData.profilePhoto : (formData.profilePhoto && formData.profilePhoto.startsWith('/') ? `http://localhost:8000${formData.profilePhoto}` : formData.profilePhoto)}
                      alt={formData.name}
                      className="w-40 h-40 bg-blue-100 text-blue-600 text-4xl"
                      sx={{ width: 160, height: 160, fontSize: 64 }}
                    >
                      {formData.name.charAt(0)}
                    </Avatar>
                    
                    {isEditing && (
                      <label htmlFor="profile-photo-input">
                        <Input
                          id="profile-photo-input"
                          type="file"
                          className="hidden"
                          sx={{ display: 'none' }}
                          accept="image/*"
                          onChange={handleProfilePhotoChange}
                        />
                        <IconButton
                          color="primary"
                          aria-label="upload picture"
                          component="span"
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
                          <PhotoCameraIcon />
                        </IconButton>
                      </label>
                    )}
                  </Box>

                  <Box className="text-center mt-4">
                    <Typography variant="h6" className="font-semibold">
                      {formData.name}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {formData.role}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="mt-1">
                      {formData.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Profile Form */}
              <Grid item xs={12} md={8}>
                <Card variant="outlined" className="h-full">
                  <CardContent>
                    <Box className="flex justify-between items-center mb-6">
                      <Typography variant="h6">Personal Information</Typography>
                      {!isEditing && (
                        <Button
                          startIcon={<EditIcon />}
                          onClick={() => setIsEditing(true)}
                          variant="outlined"
                          color="primary"
                          className="border-blue-500 text-blue-500 hover:bg-blue-50"
                        >
                          Edit
                        </Button>
                      )}
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          variant={isEditing ? "outlined" : "filled"}
                          InputProps={{
                            readOnly: !isEditing,
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          value={formData.email}
                          disabled={true} // Email cannot be changed
                          variant="filled"
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          variant={isEditing ? "outlined" : "filled"}
                          InputProps={{
                            readOnly: !isEditing,
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          select
                          label="Gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          disabled={!isEditing}
                          variant={isEditing ? "outlined" : "filled"}
                          SelectProps={{
                            native: true,
                          }}
                          InputProps={{
                            readOnly: !isEditing,
                          }}
                        >
                          <option value=""></option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </TextField>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          disabled={!isEditing}
                          variant={isEditing ? "outlined" : "filled"}
                          multiline
                          rows={2}
                          InputProps={{
                            readOnly: !isEditing,
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="City"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          disabled={!isEditing}
                          variant={isEditing ? "outlined" : "filled"}
                          InputProps={{
                            readOnly: !isEditing,
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Blood Group"
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleChange}
                          disabled={!isEditing}
                          variant={isEditing ? "outlined" : "filled"}
                          select
                          SelectProps={{
                            native: true,
                          }}
                          InputProps={{
                            readOnly: !isEditing,
                          }}
                        >
                          <option value=""></option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </TextField>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Date of Birth"
                          name="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          disabled={!isEditing}
                          variant={isEditing ? "outlined" : "filled"}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            readOnly: !isEditing,
                          }}
                        />
                      </Grid>

                      {isEditing && (
                        <Grid item xs={12}>
                          <Divider className="my-4" />
                          <Typography variant="h6" className="mb-4">Change Password</Typography>
                          
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="current-password">Current Password</InputLabel>
                                <Input
                                  id="current-password"
                                  name="currentPassword"
                                  type={showCurrentPassword ? "text" : "password"}
                                  value={formData.currentPassword}
                                  onChange={handleChange}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        edge="end"
                                      >
                                        {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                      </IconButton>
                                    </InputAdornment>
                                  }
                                  label="Current Password"
                                />
                              </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                              <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="new-password">New Password</InputLabel>
                                <Input
                                  id="new-password"
                                  name="newPassword"
                                  type={showNewPassword ? "text" : "password"}
                                  value={formData.newPassword}
                                  onChange={handleChange}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        edge="end"
                                      >
                                        {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                      </IconButton>
                                    </InputAdornment>
                                  }
                                  label="New Password"
                                />
                                <Typography variant="caption" color="textSecondary" className="mt-1">
                                  Password must be at least 8 characters long
                                </Typography>
                              </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                              <FormControl fullWidth variant="outlined">
                                <InputLabel htmlFor="confirm-password">Confirm New Password</InputLabel>
                                <Input
                                  id="confirm-password"
                                  name="confirmPassword"
                                  type={showConfirmPassword ? "text" : "password"}
                                  value={formData.confirmPassword}
                                  onChange={handleChange}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                      >
                                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                      </IconButton>
                                    </InputAdornment>
                                  }
                                  label="Confirm New Password"
                                />
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>

                    <Box className="mt-8 flex justify-between">
                      {isEditing ? (
                        <>
                          <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<CancelIcon />}
                            onClick={() => setIsEditing(false)}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {loading ? "Saving..." : "Save Changes"}
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<LogoutIcon />}
                          onClick={logout}
                          className="border-red-500 text-red-500 hover:bg-red-50"
                          fullWidth
                        >
                          Log Out
                        </Button>
                      )}
                    </Box>
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

export default Profile; 