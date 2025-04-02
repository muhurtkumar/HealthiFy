const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  specialization: { type: String, required: true, trim: true },
  experience: { type: Number, required: true, min: 0 },
  licenseNumber: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    validate: {
      validator: function(value) {
        return /^[A-Z0-9]+$/.test(value); // Ensures only uppercase letters and numbers
      },
      message: "License number should contain only uppercase letters and numbers."
    }
  },
  clinicAddress: { type: String, trim: true, required: true },
  clinicCity: { type: String, trim: true, required: true },
  availability: { 
    type: [String], 
    default: [], 
    validate: {
      validator: function(value) {
        return value.every(day => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].includes(day));
      },
      message: "Invalid day in availability"
    }
  },
  consultationFee: { type: Number, default: 500, min: 0 },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  ratings: { type: Number, default: 0, min: 0, max: 5 },
}, { timestamps: true });

module.exports = mongoose.model("Doctor", DoctorSchema);
