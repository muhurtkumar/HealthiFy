const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { 
    type: String, 
    required: [true, "Password is required"], 
    minlength: [8, "Password must be at least 8 characters long"] 
  },
  role: { 
    type: String, 
    enum: ["Patient", "Doctor", "Admin"], 
    default: "Patient" 
  },
  profilePhoto: { type: String, default: "" },
  otp: { type: String },
  otpExpires: { type: Date },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

// Hash password before saving (Only if modified)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  if (this.password.trim() === "") {
    this.password = undefined;
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
