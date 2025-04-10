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
    required: [true, "Role is required"], 
  },
  phone: { 
    type: String, 
    trim: true, 
    unique: true, 
    sparse: true, 
    minlength: 10, 
    maxlength: 10,
    validate: {
      validator: function(value) {
        return /^[0-9]{10}$/.test(value); // Only allows exactly 10 digits
      },
      message: "Phone number must be exactly 10 digits and contain only numbers."
    }
  },
  gender: { type: String, enum: ["Male", "Female", "Other"], default: "Other" },
  address: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  profilePhoto: { type: String, default: "" },
  otp: { type: String },
  otpExpires: { type: Date },
  verified: { type: Boolean, default: false },
  resetPasswordOTP: { type: String },
  resetPasswordExpires: { type: Date },
}, { timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true } 
   });

UserSchema.virtual("doctorProfile", {
  ref: "Doctor",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

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
