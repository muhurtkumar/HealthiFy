const express = require("express");
const User = require("../models/User");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Multer Setup for Profile Photo Upload
// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = './uploads';
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

// Get User Profile (Protected)
router.get("/user-profile", authMiddleware, roleMiddleware(["Patient", "Doctor"]), async (req, res) => {
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
    authMiddleware, roleMiddleware(["Patient", "Doctor"]),
    upload.single("profilePhoto"),
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
            const oldPhotoPath = path.join(
              __dirname, 
              '..', 
              user.profilePhoto.replace('/uploads/', 'uploads/')
            );
            fs.unlink(oldPhotoPath, (err) => {
              if (err) console.error("Failed to delete old photo:", err);
            });
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

module.exports = router;