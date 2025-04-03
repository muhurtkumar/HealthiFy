const express = require("express");
const Doctor = require("../../models/Doctor");
const User = require("../../models/User");
const authMiddleware = require("../../middlewares/authMiddleware");
const roleMiddleware = require("../../middlewares/roleMiddleware");

const router = express.Router();

// Get all pending doctor requests
router.get("/pending", authMiddleware, roleMiddleware(["Admin"]), async (req, res) => {
    try {
        const pendingDoctors = await Doctor.find({ status: "pending" })
            .populate("user", "name email phone gender address city state profilePhoto")
            .select("-__v -createdAt -updatedAt"); // Exclude unnecessary fields like __v, createdAt, and updatedAt

        res.status(200).json(pendingDoctors);
    } catch (error) {
        console.error("Error fetching pending doctor requests:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

// Approve or reject a doctor request
router.put("/update-status/:doctorId", authMiddleware, roleMiddleware(["Admin"]), async (req, res) => {
    try {
        const { status } = req.body;
        const { doctorId } = req.params;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ msg: "Invalid status value" });
        }

        const doctor = await Doctor.findById(doctorId).populate("user");
        if (!doctor) {
            return res.status(404).json({ msg: "Doctor not found" });
        }

        doctor.status = status;
        await doctor.save();
        
        // Update role in User model if approved
        if (status === "approved" && doctor.user) {
            await User.findByIdAndUpdate(doctor.user._id, { role: "Doctor" });
        }

        res.status(200).json({ msg: `Doctor request ${status} successfully.` });
    } catch (error) {
        console.error("Error updating doctor status:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});

module.exports = router;
