require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); 
const authRoutes = require("./routes/auth");
const errorHandler = require("./middleware/errorHandler");
const rateLimit = require("express-rate-limit");
const swaggerSetup = require("./config/swagger");

// intilise express
const app = express();
// use or read Cors
app.use(cors({
  origin: "*", // This allows all origins
  credentials: true,
}));
// use or read Express
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.json({
   message: "Byway API is running!",
    status: "active"
  });
}); 

//limit repeated requests to public APIs or endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});

// apply rate limiting to auth routes
app.use("/api/auth", authLimiter);
// use or read authRoutes
app.use("/api/auth", authRoutes);
// use or read errorHandler middleware to handle errors
app.use(errorHandler);

// Swagger documentation
swaggerSetup(app);

// Catch-all for React routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

console.log("MongoDB URL:", process.env.MONGODB_URL ? "Loaded" : "NOT LOADED");

// MongoDB connection URL - using environment variable
const url = process.env.MONGODB_URL;

const options = {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 5000,
};

// Connect to MongoDB before starting the server
const connectDB = async () => {
  try {
    await mongoose.connect(url, options);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB Error:", error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Connect to database
connectDB();

// Export the app
module.exports = app;