const { JsonWebTokenError } = require("jsonwebtoken");

const errorHandler = (err, req, res, next) => {
    console.error(err.stack); 

    //Mongoose Error Validation
    if(err.name === "validationError"){
        const errors = object.values(err.errors).map((val) => val.message);
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors,
          });
    };

    //Mongoose Duplicate Error
    if (err.code === 11000){
        return res.status(400).json({
            success: false,
            message: "Duplicate field value entered",
            field: object.keys(err.keyValue)[0]
          });
    }
    //Jwt Errors
    if (err.name === "JsonWebTokenError"){
        return res.status(401).json({
            success: false,
            message: "Invalid token",
          });
    };
    if (err.name === "TokenExpiredError"){
        return res.status(401).json({
            success: false,
            message: "Token Expired",
          });
    }
    //Default to 500 server Error
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Server Error",
        error: process.env.NODE_ENV === "development" ? err : {},
      });
    };



    // Default error message/ error code
    // const statusCode  = err.statusCode || 500;
    // const message = err.message || "Internal Server Error";

    // Send error response
    // res.status(statusCode).json({ success: false, message});


module.exports = errorHandler;