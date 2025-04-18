import React, { useState, useContext } from "react";
import { TextField, Button, CircularProgress, Typography, Box, InputAdornment } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import { AuthContext } from "../context/AuthContext";

const AdminLogin = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [securityKey, setSecurityKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { success, message } = await login(email, securityKey, "Admin");

    setLoading(false);
    if (success) {
      // Redirect on successful login
      window.location.href = "/admin/dashboard";
    } else {
      setErrorMessage(message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafb",
        padding: { xs: 2, sm: 4 },
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          boxShadow: 3,
          padding: { xs: 3, sm: 4 },
          borderRadius: 3,
          maxWidth: 400,
          width: "90%",
          textAlign: "center",
        }}
      >
        <div className="flex justify-center mb-4">
          <LockIcon sx={{ fontSize: 40 }} color="primary" />
        </div>

        <Typography variant="h5" sx={{ color: "#1f2937", fontWeight: "bold", mb: 2 }}>
          Admin Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "#6b7280" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 20,
                  backgroundColor: "#e0f2fe",
                },
                "& .MuiInputBase-input": {
                  padding: "10px",
                },
              }}
            />
          </div>

          <div className="mb-6">
            <TextField
              label="Security Key"
              variant="outlined"
              type="password"
              fullWidth
              value={securityKey}
              onChange={(e) => setSecurityKey(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#6b7280" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 20,
                  backgroundColor: "#e0f2fe",
                },
                "& .MuiInputBase-input": {
                  padding: "10px",
                },
              }}
            />
          </div>

          {errorMessage && (
            <Typography color="error" className="text-center mb-4">
              {errorMessage}
            </Typography>
          )}

          <div className="flex justify-center mb-4">
            {loading ? (
              <CircularProgress />
            ) : (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                sx={{
                  borderRadius: 20,
                  padding: "8px",
                  bgcolor: "#3b82f6",
                  "&:hover": { bgcolor: "#2563eb" },
                }}
              >
                Login
              </Button>
            )}
          </div>
        </form>
      </Box>
    </Box>
  );
};

export default AdminLogin;
