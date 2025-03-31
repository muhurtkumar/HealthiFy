import { Box, Typography, Tooltip, Badge, Snackbar, Alert, Button } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

// Notification component with clear purpose
const ProfileNotification = ({ open, onClose, position, severity, message, action }) => (
  <Snackbar 
    open={open} 
    autoHideDuration={severity === "info" ? 10000 : 6000} 
    onClose={onClose}
    anchorOrigin={position}
    className={severity === "info" ? "z-40" : "z-50"}
  >
    <Alert 
      severity={severity} 
      onClose={onClose}
      variant={severity === "info" ? "standard" : "filled"}
      className="w-full shadow-md"
      action={action}
    >
      {message}
    </Alert>
  </Snackbar>
);

// Tooltip content component for profile completion status
const ProfileCompletionTooltip = ({ percentage, incompleteFields }) => (
  <div className="p-1">
    <Typography variant="subtitle2" className="font-medium">
      Your profile is incomplete ({percentage}%)
    </Typography>
    <Typography variant="caption" className="text-xs">
      Missing: {incompleteFields.map(f => f.label).join(', ')}
    </Typography>
  </div>
);

// Header component that shows profile status and notifications
const ProfileHeaderWithStatus = ({ 
  profileCompletion,
  notificationState, 
  closeNotification, 
  showCompletionPrompt, 
  closeCompletionPrompt, 
  setIsEditMode
}) => {
  // Alert positions
  const alertPosition = { vertical: 'top', horizontal: 'center' };
  const promptPosition = { vertical: 'bottom', horizontal: 'center' };

  // Complete profile button action
  const handleCompleteProfileClick = () => {
    setIsEditMode(true);
    closeCompletionPrompt();
  };
  
  return (
    <>
      {/* Header with completion indicator */}
      <Box 
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          borderBottom: '1px solid #eaeaea',
          paddingBottom: '0.75rem'
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center'
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600,
              color: '#333',
              position: 'relative'
            }}
          >
            Your <span style={{ color: '#2563eb' }}>Profile</span>
          </Typography>
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1
          }}
        >
          {!profileCompletion.isComplete && (
            <Tooltip
              title={<ProfileCompletionTooltip {...profileCompletion} />}
              arrow
            >
              <Badge
                color="warning"
                variant="dot"
                sx={{ 
                  '& .MuiBadge-badge': { 
                    width: 10, 
                    height: 10 
                  },
                  cursor: 'pointer'
                }}
              >
                <InfoOutlinedIcon color="action" fontSize="small" />
              </Badge>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Status/error notifications */}
      <ProfileNotification 
        open={notificationState.open}
        onClose={closeNotification}
        position={alertPosition}
        severity={notificationState.severity}
        message={notificationState.message}
      />
      
      {/* Profile completion prompt */}
      <ProfileNotification
        open={showCompletionPrompt}
        onClose={closeCompletionPrompt}
        position={promptPosition}
        severity="info"
        message={`Your profile is ${profileCompletion.percentage}% complete. Add missing information to improve your experience.`}
        action={
          <Button 
            color="inherit" 
            size="small" 
            className="font-bold"
            onClick={handleCompleteProfileClick}
          >
            COMPLETE
          </Button>
        }
      />
    </>
  );
};

export default ProfileHeaderWithStatus; 