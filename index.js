require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require('./routes/auth');
const errorHandler = require("./middleware/errorHandler");
const { default: rateLimit } = require("express-rate-limit");


// intilise express
const app = express();
// use or read Cors
app.use(cors());
// use or read Express
 app.use(express.json());

//limit repeated requests to public APIs or endpoints
   const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: "Too many requests, please try again later."
    });
    // apply rate limiting to auth routes
    app.use("/api/auth", authLimiter);
 // use or read authRoutes
 app.use('/api/auth', authRoutes);
 // use or read errorHandler middleware to handle errors
 app.use(errorHandler)

// connect to MongoDB server
 mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("connected to MongoDB");
    }).catch(error => {console.log("Error", error)});
   
   
    const port = process.env.PORT || 0;
   
    app.listen(port,() => {
       console.log(`Server running on port ${port}`);
    })