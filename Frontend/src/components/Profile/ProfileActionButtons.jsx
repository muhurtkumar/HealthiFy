import { Button, Stack, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import LogoutIcon from "@mui/icons-material/Logout";

// Component for profile action buttons (edit, save, cancel, logout)
const ProfileActionButtons = ({ 
  isEditMode, 
  isUpdating, 
  setIsEditMode, 
  logout 
}) => {
  // View mode: Show Edit and Logout buttons
  if (!isEditMode) {
    return (
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setIsEditMode(true)}
          startIcon={<EditIcon />}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
            padding: '6px 16px',
            borderColor: '#2563eb',
            color: '#2563eb',
            '&:hover': {
              borderColor: '#1d4ed8',
              backgroundColor: 'rgba(37, 99, 235, 0.04)'
            }
          }}
        >
          Edit Profile
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={logout}
          startIcon={<LogoutIcon />}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
            padding: '6px 16px'
          }}
        >
          Logout
        </Button>
      </Stack>
    );
  }

  // Edit mode: Show Save and Cancel buttons
  return (
    <Stack 
      direction="row" 
      spacing={2} 
      sx={{
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >
      <Button
        variant="outlined"
        color="error"
        onClick={() => setIsEditMode(false)}
        startIcon={<CancelIcon />}
        disabled={isUpdating}
        sx={{
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '6px 16px'
        }}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
        disabled={isUpdating}
        sx={{
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '6px 16px',
          backgroundColor: '#2563eb',
          '&:hover': {
            backgroundColor: '#1d4ed8'
          }
        }}
      >
        {isUpdating ? "Saving..." : "Save Changes"}
      </Button>
    </Stack>
  );
};

export default ProfileActionButtons; 