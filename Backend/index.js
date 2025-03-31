const express = require('express');
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const auth = require("./routes/auth");
const profile = require("./routes/profile");

const app = express();
const PORT = 8000;

connectDB();

// CORS configuration for cookie-based authentication
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true, // Allow credentials (cookies)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); // Add cookie parser middleware
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/healthify/auth", auth);
app.use("/healthify/profile", profile);
app.use("/uploads", express.static("uploads")); // Serve uploaded images

// Test route
app.get('/', (req, res) => {
  res.send('Healthify API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});