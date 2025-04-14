import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
import "./index.css";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import VerifyEmail from "./components/VerifyEmail";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
import MyAppointment from "./components/MyAppointment";
import UserProfilePage from "./components/Profile/UserProfilePage";
import DoctorRegistrationForm from "./components/Doc-Registeration/RegisterationForm";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    
      <Router>
        <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Protected Routes for patients */}
+         <Route element={<PrivateRoute allowedRoles={["Patient"]} />}>
            <Route path="/my-appointments" element={<MyAppointment />} />
          </Route>
          {/* Protected Routes for doctors */}
          <Route element={<PrivateRoute allowedRoles={["Doctor"]} />}>
          <Route path="/doctor/registration-form" element={<DoctorRegistrationForm />} />
          <Route path="/doctor/doctor-dashboard" element={<Dashboard />} />
          </Route>
          {/* Protected Routes for doctors and patients */}
          <Route element={<PrivateRoute allowedRoles={["Patient", "Doctor"]} />}>
            <Route path="/profile" element={<UserProfilePage />} />
          </Route>
        </Routes>
        </AuthProvider>
      </Router>
  );
}

export default App;
