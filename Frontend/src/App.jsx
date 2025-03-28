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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/my-appointments" element={<MyAppointment />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
