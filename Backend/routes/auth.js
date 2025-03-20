const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const nodemailer = require("nodemailer");
const authMiddleware = require("../middlewares/authMiddleware");
require("dotenv").config();

const router = express.Router();

// Multer Setup for Profile Photo Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

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
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ msg: "All fields are required" });
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    const user = await User.findOne({ email });

    if (!user || !user.verified) {
      return res.status(400).json({ msg: "User is not registered or not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role, profilePhoto: user.profilePhoto || "" } 
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Get User Profile (Protected)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Logout User
router.post("/logout", (req, res) => {
  res.json({ msg: "Logged out successfully" });
});

module.exports = router;
