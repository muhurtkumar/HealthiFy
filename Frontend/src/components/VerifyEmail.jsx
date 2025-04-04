import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";

const VerifyEmail = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const role = searchParams.get('role') || 'patient';

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            setErrorMessage("No email found. Please register again.");
        }
    }, []);

    const handleChange = (index, event) => {
        let value = event.target.value;
        if (!/^\d$/.test(value) && value !== "") return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== "" && index < otp.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === "Backspace" && index > 0 && otp[index] === "") {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = async () => {
        const enteredOTP = otp.join("");

        if (!email) {
            setErrorMessage("Email is missing. Please register again.");
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const response = await fetch("http://localhost:8000/healthify/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: enteredOTP }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.removeItem("email");
                // Navigate based on role
                if (role === 'doctor') {
                    navigate("/doctor-approval-form");
                } else {
                    navigate(`/login?role=${role}`);
                }
            } else {
                setErrorMessage(data.msg || "Invalid OTP! Please try again.");
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            setErrorMessage("An error occurred while verifying OTP.");
        }

        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg text-center w-full max-w-md">
                <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
                <p className="text-gray-600 mb-4">Enter the 6-digit code sent to your email.</p>

                {errorMessage && (
                    <Typography color="error" className="mb-4">
                        {errorMessage}
                    </Typography>
                )}

                {/* OTP Input Fields */}
                <div className="grid grid-cols-6 gap-2 justify-center mb-6">
                    {otp.map((digit, index) => (
                        <TextField key={index}
                            variant="outlined"
                            className="w-full text-center"
                            inputRef={(el) => (inputRefs.current[index] = el)}
                            inputProps={{ maxLength: 1, style: { textAlign: "center", fontSize: "18px" }, autoComplete: "off" }}
                            value={digit}
                            onChange={(e) => handleChange(index, e)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                        />
                    ))}
                </div>

                {/* Verify Button */}
                <Button variant="contained" color="primary" className="w-full py-2" onClick={handleVerify} disabled={loading}>
                    {loading ? "Verifying..." : "Verify Email"}
                </Button>
            </div>
        </div>
    );
};

export default VerifyEmail;
