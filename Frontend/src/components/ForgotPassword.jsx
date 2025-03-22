import { useState } from "react";
import { TextField, Button, Typography, Box, CircularProgress, InputAdornment } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import KeyIcon from "@mui/icons-material/Key";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Step 1: Enter Email | Step 2: Enter OTP & New Password
  const [formData, setFormData] = useState({ email: "", otp: "", newPassword: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRequestOTP = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:8000/healthify/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("OTP sent to your email."); 
        setStep(2);
      } else {
        setMessage(data.msg);
      }
    } catch {
      setMessage("Server error. Please try again.");
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:8000/healthify/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Password reset successful! You can now log in.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.msg);
      }
    } catch {
      setMessage("Server error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "center", background: "#f9fafb", padding: { xs: 2, sm: 4 }, overflow: "auto" }}>
      <Box sx={{ backgroundColor: "#fff", boxShadow: 3, padding: { xs: 3, sm: 4 }, borderRadius: 3, maxWidth: 400, width: "90%", textAlign: "center", mt: { xs: 6, sm: 0 } }}>
        <Typography variant="h4" sx={{ color: "#1f2937", fontWeight: "bold", mb: 1 }}>
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </Typography>
        <Typography sx={{ color: "#6b7280", mb: 1 }}>
          {step === 1 ? "Enter your email to receive an OTP" : "Enter OTP and new password"}
        </Typography>

        {message && <Typography sx={{ color: step === 1 ? "#15803d" : "#dc2626", mt: 2 }}>{message}</Typography>}

        {step === 1 ? (
          <TextField fullWidth label="Email ID" name="email" type="email" value={formData.email} onChange={handleChange} margin="normal" variant="outlined"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 20, height: 40, backgroundColor: "#e0f2fe" }, "& .MuiInputBase-input": { padding: "10px" } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: "#6b7280" }} /></InputAdornment> }} />

        ) : (
          <>
            <TextField fullWidth label="Enter OTP" name="otp" value={formData.otp} onChange={handleChange} margin="normal" variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 20, height: 40, backgroundColor: "#e0f2fe" }, "& .MuiInputBase-input": { padding: "10px" } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><KeyIcon sx={{ color: "#6b7280" }} /></InputAdornment> }} />

            <TextField fullWidth label="New Password" name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} margin="normal" variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 20, height: 40, backgroundColor: "#e0f2fe" }, "& .MuiInputBase-input": { padding: "10px" } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon sx={{ color: "#6b7280" }} /></InputAdornment> }} />
          </>
        )}

        <Button fullWidth variant="contained" onClick={step === 1 ? handleRequestOTP : handleResetPassword} disabled={loading}
          sx={{ mt: 2, borderRadius: 20, bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" } }}>
          {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : step === 1 ? "Send OTP" : "Reset Password"}
        </Button>

        <Typography sx={{ color: "#6b7280", mt: 2 }}>
          Remember your password? <span style={{ color: "#3b82f6", cursor: "pointer" }} onClick={() => navigate("/login")}>Sign In</span>
        </Typography>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
