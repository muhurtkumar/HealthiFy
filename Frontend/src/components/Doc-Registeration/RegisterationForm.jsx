import React, { useState } from "react";
import { TextField, MenuItem, Button, InputLabel, Select, FormControl } from "@mui/material";

const DoctorRegistrationForm = () => {
  const [formData, setFormData] = useState({
    specialization: "",
    experience: "",
    licenseNumber: "",
    clinicAddress: "",
    clinicCity: "",
    consultationFee: "",
    phone: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    availability: [],
    profilePhoto: null,
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvailabilityChange = (e) => {
    const { options } = e.target;
    const selectedDays = Array.from(options)
      .filter((o) => o.selected)
      .map((o) => o.value);
    setFormData((prev) => ({ ...prev, availability: selectedDays }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profilePhoto: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    for (const key in formData) {
      if (key === "availability") {
        form.append("availability", JSON.stringify(formData[key]));
      } else {
        form.append(key, formData[key]);
      }
    }

    try {
      const res = await fetch("/api/doctor-request", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: form,
      });
      const result = await res.json();
      alert(result.message);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 shadow-lg rounded-2xl bg-white space-y-4">
      <h2 className="text-2xl font-bold text-center">Doctor Registration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} fullWidth required />
        <TextField label="Experience (in years)" name="experience" value={formData.experience} onChange={handleChange} fullWidth required />
        <TextField label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} fullWidth required />
        <TextField label="Consultation Fee" name="consultationFee" value={formData.consultationFee} onChange={handleChange} fullWidth required />
        <TextField label="Clinic Address" name="clinicAddress" value={formData.clinicAddress} onChange={handleChange} fullWidth required />
        <TextField label="Clinic City" name="clinicCity" value={formData.clinicCity} onChange={handleChange} fullWidth required />
        <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth required />
        <FormControl fullWidth required>
          <InputLabel>Gender</InputLabel>
          <Select name="gender" value={formData.gender} label="Gender" onChange={handleChange}>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth required />
        <TextField label="City" name="city" value={formData.city} onChange={handleChange} fullWidth required />
        <TextField label="State" name="state" value={formData.state} onChange={handleChange} fullWidth required />

        <FormControl fullWidth required>
          <InputLabel>Availability</InputLabel>
          <Select
            multiple
            native
            name="availability"
            value={formData.availability}
            onChange={handleAvailabilityChange}
          >
            {days.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </Select>
        </FormControl>

        <input type="file" accept="image/*" onChange={handleFileChange} required />
      </div>

      <Button type="submit" variant="contained" color="primary" className="w-full">
        Submit
      </Button>
    </form>
  );
};

export default DoctorRegistrationForm;
