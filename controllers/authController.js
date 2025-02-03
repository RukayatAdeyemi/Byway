const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
    try{
        const { firstname, lastname, username, email, password} = req.body;
        //Check if existing user
        const existingUser = await User.findOne({
            $or: [{email}, {username}],
        });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: "Email already exists" });
            }
            //Username
            if (existingUser.username === username) {
                return res.status(400).json({ message: "Username already exists" });
            };
        }
        // Create a new user
        const newUser = new User({ firstname, lastname, username, email, password});
        await newUser.save();
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                username: newUser.username,
                email: newUser.email,
            },
        });
    }
    catch(error){
        console.log("Signup Error:", error);
    res.status(500).json({ message: "Error signing up users" });
    }
};


//Operations for Login users

const login = async (req, res) => {
    try{
        const { email, password} = req.body;
        //find user by email
        const user = await User.findOne({ email});
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Email or Password"});
        }
        // compare password with the one saved in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid Email or Password"});
        }
        //Generate token when user signin
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
             expiresIn: "2d" });
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.log("Login Error:", error);
        res.status(500).json({ message: "Error occur while Logging in" }); //login error
    }
};

// Export both functions
module.exports = { signup, login };