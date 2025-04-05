const express = require("express");
const Doctor = require("../../models/Doctor");
const User = require("../../models/User");
const authMiddleware = require("../../middlewares/authMiddleware");
const multer = require("multer");
const fs = require('fs');
const path = require('path');

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

// Utility to remove uploaded file
const removeUploadedFile = (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }
  };  

const router = express.Router();

router.post("/doctor-request", authMiddleware, upload.single("profilePhoto"), async (req, res) => {
    try {
        const { specialization, experience, licenseNumber, clinicAddress, clinicCity, consultationFee, phone, gender, address, city, state} = req.body;
        const userId = req.user.id;

        // Check if user already has a doctor profile
        const existingDoctor = await Doctor.findOne({ user: userId });
        if (existingDoctor && existingDoctor.status !== "rejected") {
            removeUploadedFile(req.file?.path);
            return res.status(400).json({ message: "You already have a doctor request pending or approved" });
        }

        // Check if license number is already used
        const licenseExists = await Doctor.findOne({ licenseNumber });
        if (licenseExists) {
            removeUploadedFile(req.file?.path);
            return res.status(400).json({ message: "License number already in use." });
        }
        const availability = JSON.parse(req.body.availability);
        const profilePhoto = req.file ? `/uploads/${req.file.filename}` : "";
        // Update user info
        await User.findByIdAndUpdate(userId, {
            phone,
            gender,
            address,
            city,
            state,
            profilePhoto
        }, { runValidators: true });

        // Create new doctor request
        const newDoctor = new Doctor({
            user: userId,
            specialization,
            experience,
            licenseNumber,
            clinicAddress,
            clinicCity,
            availability,
            consultationFee,
            status: "pending",
        });

        await newDoctor.save();

        res.status(201).json({ message: "Doctor request submitted successfully. Waiting for admin approval." });
    } catch (error) {
        console.error("Error submitting doctor request:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
