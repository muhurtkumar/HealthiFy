import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  AppBar, Toolbar, IconButton, Menu, MenuItem, Avatar, Button, Box, Drawer, List, ListItem, ListItemText, 
  Divider, Typography, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Tooltip, Badge
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

const Navbar = () => {
  const { isAuthenticated, user, logout, profileStatus } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const navigate = useNavigate();

  const isMobile = useMediaQuery('(max-width:680px)');

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpenLogoutDialog(false);
  };

  let navItems = [];

  if (isAuthenticated && (user?.role === "Doctor" || user?.role === "Admin")) {
    navItems = [];
  } else {
    navItems = [
      { path: "/", label: "Home" },
      { path: "/doctors", label: "Doctors" },
      { path: "/about", label: "About" },
      { path: "/contact", label: "Contact" },
    ];
  }

  const isAdmin = user?.role === "Admin";
  const isDoctorOrAdmin = user?.role === "Doctor" || isAdmin;

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="sticky" className="bg-blue-600 shadow-md">
        <Toolbar className="flex justify-between items-center px-4 h-16">
          {/* Logo */}
          <NavLink to="/" className="text-2xl font-bold text-white no-underline">
            Health<span className="text-red-500">iFy</span>
          </NavLink>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box className="flex space-x-6 text-white text-lg" sx={{ flex: 1, justifyContent: 'center' }}>
              {navItems.map(({ path, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `${isActive ? "text-red-600 font-semibold" : "hover:text-red-500 transition duration-300"} no-underline px-2`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </Box>
          )}

          {/* Right Section (Avatar & Login) */}
          <Box className="flex items-center" sx={{ minWidth: isMobile ? 'auto' : '180px', justifyContent: 'flex-end' }}>
            {isAuthenticated ? (
              <>
                {!isMobile && (
                  <>
                    {!isAdmin ? (
                      <>
                        {/* Profile completion notification - only show if not admin*/}
                        {!profileStatus.isComplete && (
                          <Tooltip 
                            title={
                              <Box p={1}>
                                <Typography variant="subtitle2">
                                  Your profile is incomplete ({profileStatus.percentage}%)
                                </Typography>
                                <Typography variant="body2" fontSize="12px">
                                  Complete your profile for a better experience
                                </Typography>
                              </Box>
                            }
                            arrow
                            placement="bottom"
                          >
                            <IconButton 
                              size="small" 
                              onClick={() => navigate('/profile')}
                              sx={{ mr: 1 }}
                            >
                              <Badge 
                                color="error" 
                                variant="dot"
                                overlap="circular"
                                badgeContent=""
                              >
                                <NotificationsNoneIcon fontSize="small" />
                              </Badge>
                            </IconButton>
                          </Tooltip>
                        )}
                        <Box
                          onClick={handleMenuOpen}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '30px',
                            padding: '4px 16px 4px 4px',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 1)',
                            },
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            gap: '8px',
                            width: '140px',
                            justifyContent: 'flex-start',
                            minWidth: '140px',
                            transition: 'none'
                          }}
                        >
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              !profileStatus.isComplete ? (
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    bgcolor: 'error.main',
                                    borderRadius: '50%',
                                    border: '2px solid white',
                                  }}
                                />
                              ) : null
                            }
                          >
                            <Avatar
                              src={user?.avatar && typeof user?.avatar === 'string' && user?.avatar.startsWith('http') ? user.avatar : undefined}
                              sx={{ 
                                width: 36, 
                                height: 36,
                              }}
                            >
                              {typeof user?.avatar === 'string' && !user?.avatar.startsWith('http') ? user.avatar : user?.name?.charAt(0).toUpperCase() || 'U'}
                            </Avatar>
                          </Badge>
                          <Typography
                            sx={{
                              fontSize: '14px',
                              fontWeight: 500,
                              color: '#444',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              width: '70px',
                              maxWidth: '70px'
                            }}
                          >
                            {user?.name 
                              ? user.name.split(' ')[0].toLowerCase() 
                              : user?.email?.split('@')[0]}
                          </Typography>
                          <MoreVertIcon 
                            sx={{ 
                              fontSize: 18,
                              color: '#666',
                              marginLeft: 'auto'
                            }}
                          />
                        </Box>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={() => setOpenLogoutDialog(true)}
                        sx={{
                          borderRadius: "20px",
                          backgroundColor: "#f44336",
                          color: "white",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: "#d32f2f",
                          },
                        }}
                      >
                        Logout
                      </Button>
                    )}
                  </>
                )}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  keepMounted
                  disableScrollLock={true}
                  disablePortal={false}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    }
                  }}
                >
                  {!isAdmin && (
                    <MenuItem 
                      onClick={() => { navigate("/profile"); handleMenuClose(); }} 
                      className="hover:bg-gray-100"
                    >
                      <Box display="flex" alignItems="center" width="100%">
                        <Typography>Profile</Typography>
                        {!profileStatus.isComplete && (
                          <Box 
                            component="span"
                            sx={{
                              ml: 'auto',
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: 'error.main'
                            }}
                          />
                        )}
                      </Box>
                    </MenuItem>
                  )}
                  {!isDoctorOrAdmin && (
                    <MenuItem onClick={() => { navigate("/my-appointments"); handleMenuClose(); }} className="hover:bg-gray-100">
                      My Appointments
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={() => { setOpenLogoutDialog(true); handleMenuClose(); }} className="hover:bg-red-50 text-red-600">
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              !isMobile && (
                <NavLink to="/login">
                  <Button variant="contained" sx={{ borderRadius: "20px", backgroundColor: "#4a90e2", color: "white", textTransform: "none" }}>Login</Button>
                </NavLink>
              )
            )}
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton edge="end" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
        {/* Mobile Drawer */}
        <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
          <Box className="w-72 flex flex-col h-full bg-white">
            <Box className="flex justify-between items-center px-4 py-3 border-b">
              <Box className="flex items-center space-x-3">
                {isAuthenticated && (
                  <Avatar
                    src={user?.avatar && typeof user?.avatar === 'string' && user?.avatar.startsWith('http') ? user.avatar : undefined}
                    className="bg-blue-600 text-white font-bold"
                  >
                    {typeof user?.avatar === 'string' && !user?.avatar.startsWith('http') ? user.avatar : user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                )}
                <Typography variant="h6" className="text-blue-600 font-semibold">
                  Menu
                </Typography>
              </Box>
              <IconButton onClick={handleDrawerToggle}>
                <CloseIcon />
              </IconButton>
            </Box>
            {/* Menu Items */}
            <List className="flex-grow">
              {navItems.map(({ path, label }) => (
                <ListItem key={path} component="div" onClick={handleDrawerToggle}>
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      isActive ? "text-red-600 font-semibold" : "text-black hover:text-red-500 transition duration-300"
                    }
                  >
                    <ListItemText primary={label} />
                  </NavLink>
                </ListItem>
              ))}
            </List>

            <Divider />
            {/* Authentication Options */}
            <Box className="p-4">
              {isAuthenticated ? (
                <>
                  {!isAdmin && (
                    <Button fullWidth className="bg-gray-100 text-black" onClick={() => { navigate("/profile"); handleDrawerToggle(); }}>
                      Profile
                    </Button>
                  )}
                  {!isDoctorOrAdmin && (
                    <Button fullWidth className="bg-gray-100 text-black mt-2" onClick={() => { navigate("/my-appointments"); handleDrawerToggle(); }}>
                      My Appointments
                    </Button>
                  )}
                  <Button fullWidth className="bg-red-500 text-white mt-2" onClick={() => { setOpenLogoutDialog(true); handleDrawerToggle(); }}>Logout</Button>
                </>
              ) : (
                <NavLink to="/login">
                  <Button fullWidth className="bg-blue-500 text-white mt-2" onClick={handleDrawerToggle}>
                    Login
                  </Button>
                </NavLink>
              )}
            </Box>
          </Box>
        </Drawer>
        <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
          <DialogTitle>Are You Sure?</DialogTitle>
          <DialogContent>
            <DialogContentText>Do you really want to logout?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenLogoutDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleLogout} color="error">
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navbar;