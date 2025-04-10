const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

// Nodemailer Setup for Sending OTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Step 1: Register User & Send OTP
router.post("/register", async (req, res) => {
  try {
    const { email, name, password, role } = req.body;

    if (!email || !name || !password || !role) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const allowedRoles = ["Patient", "Doctor", "Admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ msg: "Invalid role. Must be Patient, Doctor, or Admin." });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ msg: "Password must be at least 8 characters long" });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already registered. Please log in." });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Temporarily store user details
    user = new User({
      email,
      name,
      password,
      role,
      verified: false,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000, // OTP expires in 5 minutes
    });

    await user.save();

    // Send OTP to email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ msg: "OTP sent to email. Please verify to complete registration." });

  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Step 2: Verify OTP & Complete Registration
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found!" });

    if (!user.otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ msg: "OTP expired. Please request a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    // Mark user as verified
    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ msg: "OTP verified. Registration complete! You can now log in." });

  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const user = await User.findOne({ email }).populate("doctorProfile");

    if (!user || !user.verified) {
      return res.status(400).json({ msg: "User is not registered or not verified" });
    }

    if (user.role !== role) {
      return res.status(403).json({ msg: `You are not registered as a ${role}` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Set cookie with token
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    let redirect = "/";
    let message = "";
    // Doctor-specific redirect logic
    if (role === "Doctor") {
      const doctorProfile = user.doctorProfile;

      if (!doctorProfile || doctorProfile.status === "rejected") {
        redirect = "/healthify/doctor/doctor-request";
      } else if (doctorProfile.status === "pending") {
        redirect = "/healthify/doctor/doctor-request";
        message = "Waiting for admin approval";
      } else if (doctorProfile.status === "approved") {
        redirect = "/healthify/doctor/doctor-dashboard";
      }
    }

    res.json({ 
      success: true,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        profilePhoto: user.profilePhoto || "",
        doctorStatus: user.doctorProfile?.status || null
      },
      redirect,
      message
    });    

  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Forgot Password - Send OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ msg: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
    await user.save();

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your password reset OTP is: ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ msg: "OTP sent to email. Please enter it to reset your password." });

  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Reset Password using OTP
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ msg: "Password must be at least 8 characters long" });
    }

    const user = await User.findOne({ email });

    if (!user || !user.resetPasswordOTP || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ msg: "Incorrect OTP" });
    }

    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ msg: "Password reset successfully. You can now log in." });

  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Logout User
router.post("/logout", (req, res) => {
  res.clearCookie('jwt');
  res.json({ msg: "Logged out successfully" });
});

module.exports = router;
