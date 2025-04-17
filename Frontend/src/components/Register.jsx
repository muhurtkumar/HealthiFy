import { useState } from "react";
import { TextField, Button, Typography, Box, CircularProgress, InputAdornment, IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const sendOTP = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:8000/healthify/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("OTP sent to your email.");
        localStorage.setItem("email", formData.email);
        navigate("/verify-email");
      } else {
        setMessage(data.msg);
      }
    } catch {
      setMessage("Server error. Please try again.");
    }
    setLoading(false);
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Box sx={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "center", background: "#f9fafb", padding: { xs: 2, sm: 4 }, overflow: "auto" }}>
      <Box sx={{ backgroundColor: "#fff", boxShadow: 3, padding: { xs: 3, sm: 4 }, borderRadius: 3, maxWidth: 400, width: "90%", textAlign: "center", mt: { xs: 6, sm: 0 } }}>
        <Typography variant="h4" sx={{ color: "#1f2937", fontWeight: "bold", mb: 1 }}>Create Account</Typography>
        <Typography sx={{ color: "#6b7280", mb: 1 }}>Create your account</Typography>

        {["name", "email", "password"].map((field, index) => (
          <TextField key={index} fullWidth label={field === "name" ? "Full Name" : field === "email" ? "Email ID" : "Password"} name={field} type={field === "password" ? (showPassword ? "text" : "password") : "text"} value={formData[field]} onChange={handleChange} margin="normal" variant="outlined"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 20, height: 40, backgroundColor: "#e0f2fe" }, "& .MuiInputBase-input": { padding: "10px" } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {field === "name" ? <PersonIcon sx={{ color: "#6b7280" }} /> : field === "email" ? <EmailIcon sx={{ color: "#6b7280" }} /> : <LockIcon sx={{ color: "#6b7280" }} />}
                </InputAdornment>
              ),
              endAdornment: field === "password" && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        ))}

        {message && <Typography sx={{ color: "#16a34a", mt: 2 }}>{message}</Typography>}

        <Button fullWidth variant="contained" onClick={sendOTP} disabled={loading}
          sx={{ mt: 1, borderRadius: 20, bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" } }}>
          {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Sign Up"}
        </Button>

        <Typography sx={{ color: "#6b7280", mt: 2 }}>Already have an account? <span style={{ color: "#3b82f6", cursor: "pointer" }} onClick={() => navigate("/login")}>Login</span></Typography>
      </Box>
    </Box>
  );
};

export default Register;
