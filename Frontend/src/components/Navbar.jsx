import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  AppBar, Toolbar, IconButton, Menu, MenuItem, Avatar, Button, Box, Drawer, List, ListItem, ListItemText, 
  Divider, Typography, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme();

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const navigate = useNavigate();

  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpenLogoutDialog(false);
  };

  let navItems = [];

  if (isAuthenticated && user?.role === "doctor") {
    navItems = [
      { path: "/dashboard", label: "Dashboard" },
      { path: "/patient-requests", label: "Patient Requests" },
      { path: "/video-calls", label: "Video Calls" },
    ];
  } else {
    navItems = [
      { path: "/", label: "Home" },
      { path: "/doctors", label: "Doctors" },
      { path: "/about", label: "About" },
      { path: "/contact", label: "Contact" },
    ];
  }

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="sticky" className="bg-blue-600 shadow-md">
        <Toolbar className="flex justify-between items-center px-4">
          {/* Logo */}
          <NavLink to="/" className="text-2xl font-bold text-white">
            Health<span className="text-red-500">iFy</span>
          </NavLink>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box className="flex space-x-6 text-white text-lg">
              {navItems.map(({ path, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    isActive ? "text-red-600 font-semibold" : "hover:text-red-500 transition duration-300"
                  }
                >
                  {label}
                </NavLink>
              ))}
            </Box>
          )}

          {/* Right Section (Avatar & Login) */}
          <Box className="flex items-center">
            {isAuthenticated ? (
              <>
                {!isMobile && (
                  <IconButton onClick={handleMenuOpen}>
                    <Avatar
                      src={typeof user?.avatar === "string" && user?.avatar.startsWith("http") ? user.avatar : undefined}
                      className="bg-blue-600 text-white font-bold"
                    >
                      {typeof user?.avatar === "string" && !user?.avatar.startsWith("http") ? user.avatar : "U"}
                    </Avatar>

                  </IconButton>
                )}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={() => { navigate("/profile"); handleMenuClose(); }} className="hover:bg-gray-100">
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => { navigate("/my-appointments"); handleMenuClose(); }} className="hover:bg-gray-100">
                    My Appointments
                  </MenuItem>
                  <MenuItem onClick={() => { setOpenLogoutDialog(true); handleMenuClose(); }} className="hover:bg-red-100 text-red-600">Logout</MenuItem>
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
            {/* Header with Avatar and Close Button */}
            <Box className="flex justify-between items-center px-4 py-3 border-b">
              <Box className="flex items-center space-x-3">
                {isAuthenticated && (
                  <Avatar
                    src={typeof user?.avatar === "string" && user?.avatar.startsWith("http") ? user.avatar : undefined}
                    className="bg-blue-600 text-white font-bold"
                  >
                    {typeof user?.avatar === "string" && !user?.avatar.startsWith("http") ? user.avatar : "U"}
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
                <ListItem key={path} button onClick={handleDrawerToggle}>
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
                  <Button fullWidth className="bg-gray-100 text-black" onClick={() => { navigate("/profile"); handleDrawerToggle(); }}>
                    Profile
                  </Button>
                  <Button fullWidth className="bg-gray-100 text-black mt-2" onClick={() => { navigate("/my-appointments"); handleDrawerToggle(); }}>
                    My Appointments
                  </Button>
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