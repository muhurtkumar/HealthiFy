import { useState, useContext } from "react";
import { TextField, Button, Typography, Box, CircularProgress, InputAdornment, IconButton, Radio, RadioGroup, FormControlLabel, FormControl } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "", role: "Patient" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRoleChange = (e) => {
    setFormData(prev => ({ ...prev, role: e.target.value }));
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");
    try {
      const result = await login(formData.email, formData.password, formData.role);
      if (result.success) navigate("/");
      else setMessage(result.message || "Login failed");
    } catch (error) {
      setMessage("An error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  return (
    <Box sx={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "center", background: "#f9fafb", padding: { xs: 2, sm: 4 }, overflow: "auto" }}>
      <Box sx={{ backgroundColor: "#fff", boxShadow: 3, padding: { xs: 3, sm: 4 }, borderRadius: 3, maxWidth: 400, width: "90%", textAlign: "center", mt: { xs: 6, sm: 0 } }}>
        <Typography variant="h4" sx={{ color: "#1f2937", fontWeight: "bold", mb: 1 }}>Welcome Back</Typography>
        <Typography sx={{ color: "#6b7280", mb: 1 }}>Sign in to your account</Typography>

        <FormControl component="fieldset" sx={{ width: '100%', mb: 2 }}>
          <RadioGroup row aria-label="role" name="role" value={formData.role} onChange={handleRoleChange} sx={{ justifyContent: 'center', gap: 3 }} >
            <FormControlLabel value="Patient" control={<Radio />} label="Patient" sx={{ margin: 0 }} />
            <FormControlLabel value="Doctor" control={<Radio />} label="Doctor"sx={{ margin: 0 }} />
          </RadioGroup>
        </FormControl>

        {["email", "password"].map((field, index) => (
          <TextField key={index} fullWidth label={field === "email" ? "Email ID" : "Password"} name={field} type={field === "password" ? (showPassword ? "text" : "password") : "text"} value={formData[field]} onChange={handleChange} margin="normal" variant="outlined"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 20, height: 40, backgroundColor: "#e0f2fe" }, "& .MuiInputBase-input": { padding: "10px" } }}
            InputProps={{
              startAdornment: <InputAdornment position="start">{field === "email" ? <EmailIcon sx={{ color: "#6b7280" }} /> : <LockIcon sx={{ color: "#6b7280" }} />}</InputAdornment>,
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

        {/* Forgot Password UI */}
        <Typography sx={{ color: "#3b82f6", textAlign: "right", mt: 1, cursor: "pointer" }} onClick={() => navigate("/forgot-password")}>
          Forgot Password?
        </Typography>

        {message && <Typography sx={{ color: "#dc2626", mt: 2 }}>{message}</Typography>}

        <Button fullWidth variant="contained" onClick={handleLogin} disabled={loading}
          sx={{ mt: 2, borderRadius: 20, bgcolor: "#3b82f6", "&:hover": { bgcolor: "#2563eb" } }}>
          {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Sign In"}
        </Button>

        <Typography sx={{ color: "#6b7280", mt: 2 }}>Don't have an account? <span style={{ color: "#3b82f6", cursor: "pointer" }} onClick={() => navigate("/register")}>Sign Up</span></Typography>
      </Box>
    </Box>
  );
};

export default Login;
