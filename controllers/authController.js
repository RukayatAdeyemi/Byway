const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//Signup function
const signup = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      username,
      password,
      role,
      bio,
      experience,
      title,
      socialLinks,
      profileImage
    } = req.body;
    //Check if existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    //If Existing User
    if(existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.username===username? "Username already exists" : "Email already exists",
      })
    };
    // Create new User with Optional Fields
    const newUser = new User({
      firstname,
      lastname,
      username, 
      email,
      password,
      // add optional fields
      ...(role && {role}),
      ...(bio && {bio}),
      ...(title && {title}),
      ...(experience && {experience}),
      ...(socialLinks && {socialLinks}),
      ...(profileImage && {profileImage}),
    });
    await newUser.save();
    res.status(201).json({
      success: truec,
      message: "User created successfully",
      user: {
        id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        username: newUser.username,
        email: newUser.email,
        profileImage: newUser.profileImage,
        role: newUser.role,
        bio: newUser.bio,
        title: newUser.title,
        experience: newUser.experience,
        socialLinks: newUser.socialLinks,
      }
    });
  } catch (error) {
    console.log("Signup Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error signing up users",
      error: error.message,
    });
  }
};



//Operations for Login users

const login = async (req, res) => {
  try {
    const {username, email, password} = req.body;
    if (!username && !email) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide a username or email" 
      });
    }
  } catch (error) {
    
  }
}

// Export both functions
module.exports = { signup, login };
