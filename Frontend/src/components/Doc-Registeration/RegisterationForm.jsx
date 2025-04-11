import React, { useState } from "react";
import {
  TextField,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import FormContainer from "./FormContainer";
import FormAlert from "./FormAlert";
import FileUpload from "./FileUpload";
import SubmitButton from "./SubmitButton";

const DoctorRegistrationForm = () => {
  const [formData, setFormData] = useState({
    specialization: "", experience: "", licenseNumber: "", clinicAddress: "", clinicCity: "", consultationFee: "", phone: "", gender: "", address: "", city: "", state: "", availability: [], profilePhoto: null,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvailabilityChange = (event) => {
    const { target: { value } } = event;
    setFormData((prev) => ({ ...prev, availability: typeof value === "string" ? value.split(",") : value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Only JPG, JPEG, PNG, and WEBP formats are allowed.");
      setFormData((prev) => ({ ...prev, profilePhoto: null }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image size should be less than 5MB.");
      setFormData((prev) => ({ ...prev, profilePhoto: null }));
      return;
    }

    setFormData((prev) => ({ ...prev, profilePhoto: file }));
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(formData.phone)) {
      setErrorMessage("Phone number must be a valid 10-digit number.");
      setIsSubmitting(false);
      return;
    }

    if (isNaN(formData.experience) || isNaN(formData.consultationFee)) {
      setErrorMessage("Experience and Consultation Fee must be valid numbers.");
      setIsSubmitting(false);
      return;
    }

    const licensePattern = /^[A-Z0-9]+$/;
    if (!licensePattern.test(formData.licenseNumber)) {
      setErrorMessage("Wrong Licence Number");
      setIsSubmitting(false);
      return;
    }

    if (!formData.profilePhoto) {
      setErrorMessage("Please upload a valid profile photo under 5MB.");
      setIsSubmitting(false);
      return;
    }

    const form = new FormData();
    for (const key in formData) {
      form.append(key, key === "availability" ? JSON.stringify(formData[key]) : formData[key]);
    }

    try {
      const res = await fetch("http://localhost:8000/healthify/doctor/doctor-request", {
        method: "POST", credentials: "include", body: form,
      });

      const result = await res.json();
      if (res.ok) {
        setSuccessMessage(result.message || "Submitted successfully.");
        setErrorMessage("");
        setFormData({ specialization: "", experience: "", licenseNumber: "", clinicAddress: "", clinicCity: "", consultationFee: "", phone: "", gender: "", address: "", city: "", state: "", availability: [], profilePhoto: null });
        document.getElementById("profile-photo-input").value = "";
      } else {
        setErrorMessage(result.message || "Submission failed.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setErrorMessage("Network or server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer title="Doctor Registration Form">
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormAlert type="success" message={successMessage} />
        <FormAlert type="error" message={errorMessage} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextField label="Specialization" name="specialization" value={formData.specialization} onChange={handleChange} fullWidth required />
          <TextField label="Experience (in years)" name="experience" value={formData.experience} onChange={handleChange} fullWidth required />
          <TextField label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} fullWidth required />
          <TextField label="Consultation Fee" name="consultationFee" value={formData.consultationFee} onChange={handleChange} fullWidth required />
          <TextField label="Clinic Address" name="clinicAddress" value={formData.clinicAddress} onChange={handleChange} fullWidth required multiline rows={2} />
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
          <TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth required multiline rows={2} />
          <TextField label="City" name="city" value={formData.city} onChange={handleChange} fullWidth required />
          <TextField label="State" name="state" value={formData.state} onChange={handleChange} fullWidth required />
          <FormControl fullWidth required>
            <InputLabel>Availability</InputLabel>
            <Select multiple value={formData.availability} onChange={handleAvailabilityChange} input={<OutlinedInput label="Availability" />} renderValue={(selected) => selected.join(", ")}>
              {days.map((day) => (
                <MenuItem key={day} value={day}>
                  <Checkbox checked={formData.availability.includes(day)} />
                  <ListItemText primary={day} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FileUpload label="Profile Photo (Max 5MB)" onChange={handleFileChange} id="profile-photo-input" accept="image/jpeg,image/jpg,image/png,image/webp" required />
        </div>
        <div className="flex justify-center mt-8">
          <SubmitButton loading={isSubmitting} label="Submit" fullWidth={false} />
        </div>
      </form>
    </FormContainer>
  );
};

export default DoctorRegistrationForm;
