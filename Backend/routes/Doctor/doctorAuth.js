const express = require("express");
const Doctor = require("../../models/Doctor");
const User = require("../../models/User");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/doctor-request", authMiddleware, async (req, res) => {
    try {
        const { specialization, experience, licenseNumber, clinicAddress, clinicCity, availability, consultationFee } = req.body;
        const userId = req.user.id;

        // Check if user already has a doctor profile
        const existingDoctor = await Doctor.findOne({ user: userId });
        if (existingDoctor && existingDoctor.status !== "rejected") {
            return res.status(400).json({ message: "You already have a doctor request pending or approved" });
        }

        // Check if license number is already used
        const licenseExists = await Doctor.findOne({ licenseNumber });
        if (licenseExists) {
            return res.status(400).json({ message: "License number already in use." });
        }

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
            status: "pending"
        });

        await newDoctor.save();

        res.status(201).json({ message: "Doctor request submitted successfully. Waiting for admin approval." });
    } catch (error) {
        console.error("Error submitting doctor request:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
