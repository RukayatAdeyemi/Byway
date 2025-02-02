require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


// intilise express
const app = express();
app.use(cors());
 app.use(express.json());


 
 mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("connected to MongoDB");
    }).catch(error => {console.log("Error", error)});
   
   
    const port = process.env.PORT || 0;
   
    app.listen(port,() => {
       console.log(`Server running on port ${port}`);
    })