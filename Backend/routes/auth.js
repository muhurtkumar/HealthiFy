const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const nodemailer = require("nodemailer");
const authMiddleware = require("../middlewares/authMiddleware");
const fs = require('fs');
const path = require('path');
require("dotenv").config();

const router = express.Router();

// Multer Setup for Profile Photo Upload
// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${req.user.id}-${Date.now()}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only .jpg, .jpeg, .png, and .webp formats allowed"), false);
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

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

    // Set cookie with token
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ 
      user: { id: user._id, name: user.name, email: user.email, role: user.role, profilePhoto: user.profilePhoto || "" } 
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

// Update User Profile (Protected)
router.put(
  "/update-profile",
  authMiddleware,
  (req, res, next) => {
    // Error handling middleware for multer
    upload.single("profilePhoto")(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          // Multer error (file too large, etc)
          return res.status(400).json({ 
            msg: err.code === 'LIMIT_FILE_SIZE' 
              ? "File size too large. Maximum size is 5MB." 
              : `Upload error: ${err.message}` 
          });
        } else {
          // Other errors (file type, etc)
          return res.status(400).json({ 
            msg: err.message || "Unknown file upload error" 
          });
        }
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, phone, address, city, state, gender } = req.body;

      // Fetch existing user first
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ msg: "User not found" });

      // Build update object
      const updateFields = {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(address && { address }),
        ...(city && { city }),
        ...(state && { state }),
        ...(gender && { gender }),
      };

      // Handle profile photo
      if (req.file) {
        updateFields.profilePhoto = `/uploads/${req.file.filename}`;
        
        // Delete old photo safely
        if (user.profilePhoto) {
          try {
            const oldPhotoPath = path.join(
              __dirname, 
              '..', 
              user.profilePhoto.replace(/^\/uploads\//, 'uploads/')
            );
            if (fs.existsSync(oldPhotoPath)) {
              fs.unlinkSync(oldPhotoPath);
            }
          } catch (err) {
            console.error("Failed to delete old photo:", err);
          }
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateFields,
        { 
          new: true,
          runValidators: true
        }
      ).select("-password -otp -resetPasswordToken");

      res.json({
        msg: "Profile updated successfully",
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          profilePhoto: updatedUser.profilePhoto || "",
          phone: updatedUser.phone || "",
          address: updatedUser.address || "",
          city: updatedUser.city || "",
          state: updatedUser.state || "",
          gender: updatedUser.gender || "Other"
        }
      });

    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ 
          msg: `${Object.keys(err.keyValue)[0]} already exists`
        });
      }
      if (err.name === "ValidationError") {
        return res.status(400).json({ 
          msg: Object.values(err.errors)[0].message 
        });
      }
      console.error("Server crash prevented:", err);
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  }
);

// Logout User
router.post("/logout", (req, res) => {
  res.clearCookie('jwt');
  res.json({ msg: "Logged out successfully" });
});

module.exports = router;
