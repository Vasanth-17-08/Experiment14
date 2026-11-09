// Load environment variables
require("dotenv").config();

// Import packages
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");

// Create Express application
const app = express();

app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Environment variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Database connection status
let databaseConnected = false;

// Connect to MongoDB if connection string is available
if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
        .then(() => {
            databaseConnected = true;
            console.log("MongoDB Connected Successfully");
        })
        .catch((error) => {
            console.error("MongoDB Connection Error:", error.message);
        });
} else {
    console.log("MONGO_URI is not configured");
}

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API status route
app.get("/api/status", (req, res) => {
    res.json({
        message: "Full Stack Application is Running Successfully!",
        database: databaseConnected ? "Connected" : "Not Connected",
        jwtConfigured: Boolean(JWT_SECRET)
    });
});

// JWT test route
app.get("/api/token", (req, res) => {
    if (!JWT_SECRET) {
        return res.status(500).json({
            message: "JWT_SECRET is not configured"
        });
    }

    const token = jwt.sign(
        { purpose: "deployment-test" },
        JWT_SECRET,
        { expiresIn: "5m" }
    );

    res.json({
        message: "JWT generated successfully",
        token
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
});