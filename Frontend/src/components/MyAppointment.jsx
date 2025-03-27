import { Typography, List, Button } from "@mui/material";
import { Favorite, CalendarMonth, Medication } from "@mui/icons-material";
import AppointmentItem from "./AppointmentItem";

const appointmentOptions = [
  { icon: <Favorite />, title: "Medical History", subtitle: "View and edit your medical history", route: "/my-appointments/medical-history" },
  { icon: <CalendarMonth />, title: "Upcoming Appointments", subtitle: "View and edit your upcoming appointments", route: "/my-appointments/appointments" },
  { icon: <Medication />, title: "Prescription List", subtitle: "View and edit your prescriptions", route: "/my-appointments/prescriptions" },
];

export default function MyAppointment() {
  const handleReminderClick = () => {
    alert("Reminders Set!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-6">
      <div className="w-full max-w-2xl p-8">
        <Typography variant="h5" className="font-bold mb-4">My Appointments</Typography>
        
        <List>
          {appointmentOptions.map((option, index) => (
            <AppointmentItem key={index} {...option} />
          ))}
        </List>
        
        <div className="flex flex-col gap-3 mt-4">
          <Button 
            variant="contained" 
            fullWidth 
            className="bg-blue-600 text-white hover:bg-blue-700" 
            onClick={handleReminderClick}
          >
            Set Appointment Reminders
          </Button>
        </div>
      </div>
    </div>
  );
}
