const jwt = require("jsonwebtoken")
const User = require("../models/User")


const authMiddleware = async (req, res, next) => {
    try {
        // Get token from headers
        // const token = req.header.authorization?.split(" ")[1]; / ask in class
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];
        //Check if token is provided
        if (!token){
            return res.status(401).json({
              success: false,
              message: "No Token provided, authorization denied",
            });
          }
          //Verify Token
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          //Find
          const user = await User.findById(decoded.userId).select("-password");
          if (!user){
            return res.status(401).json({
              success: false,
              message: "User not found",
            });
          }
          // Set both userId and Token in request object for flexibility
          req.userId= decoded.userId;
          req.user= user;
          next();
    } catch (error) {
        return res.status(401).json({
          success: false,
          message: "Token is not valid or has expired",
          error: error.message
        });
    }
};

module.exports = authMiddleware;