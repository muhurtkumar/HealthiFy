const express = require('express');
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const path = require('path');
const auth = require("./routes/auth");

const app = express();
const PORT = 8000;

connectDB();

// CORS configuration for cookie-based authentication
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3001',
    /^http:\/\/192\.168\.\d+\.\d+:\d+$/  // Allow any IP in 192.168.x.x range with any port
  ],
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

// Serve uploaded images with absolute path for reliability
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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