const errorHandler = (err, req, res, next) => {
    console.log("Error", err);

    // Default error message/ error code
    const statusCode  = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Send error response
    res.status(statusCode).json({ success: false, message});
}

module.exports = errorHandler;