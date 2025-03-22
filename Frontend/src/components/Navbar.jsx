import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Avatar, Button, Box } from "@mui/material";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar position="sticky" className="bg-blue-600 shadow-md">
      <Toolbar className="flex justify-between items-center px-4">
        <Link to="/" className="text-2xl font-bold text-white">Health<span className="text-red-500">iFy</span></Link>

        <Box className="flex items-center">
          {isAuthenticated ? (
            <>
              <IconButton onClick={handleMenuOpen}>
                <Avatar className="bg-white text-blue-600 font-bold">{user?.name?.charAt(0).toUpperCase()}</Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }}>
                <MenuItem onClick={() => { logout(); navigate("/login"); handleMenuClose(); }}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Link to="/login">
              <Button variant="contained" sx={{ borderRadius: "20px", backgroundColor: "#4a90e2", color: "white", textTransform: "none" }}>Login</Button>
            </Link>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
