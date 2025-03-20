import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function App() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Fixed Navbar */}
      <AppBar position="fixed">
        <Toolbar>
          {/* Hamburger Menu for Mobile */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: "block", md: "none" } }} // Show only on mobile
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo or Brand Name */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            HealthiFy
          </Typography>

          {/* Navigation Links for Desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button color="inherit" href="#home">
              Home
            </Button>
            <Button color="inherit" href="#about">
              About
            </Button>
            <Button color="inherit" href="#contact">
              Contact
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu */}
      <Menu
        id="mobile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ display: { xs: "block", md: "none" } }} // Show only on mobile
      >
        <MenuItem onClick={handleMenuClose} component="a" href="#home">
          Home
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component="a" href="#about">
          About
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component="a" href="#contact">
          Contact
        </MenuItem>
      </Menu>

      {/* Add padding to the bottom of the page to prevent content from being hidden under the fixed navbar */}
      
      <Box sx={{ height: "64px" }}>
      </Box>
    </Box>
  );
}
