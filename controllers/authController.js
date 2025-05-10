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
      profileImage,
    } = req.body;

    //Check if existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    //If Existing User
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.username === username
            ? "Username already exists"
            : "Email already exists",
      });
    }

    // Create new User with Optional Fields
    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      password,
      // add optional fields
      ...(role && { role }),
      ...(bio && { bio }),
      ...(title && { title }),
      ...(experience && { experience }),
      ...(socialLinks && { socialLinks }),
      ...(profileImage && { profileImage }),
    });
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
        profileImage: newUser.profileImage,
        role: newUser.role,
        bio: newUser.bio,
        title: newUser.title,
        experience: newUser.experience,
        socialLinks: newUser.socialLinks,
      },
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
    const { username, email, password } = req.body;
    if (!username && !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide a username or email",
      });
    }

    // Find User by Email or Username
    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    // If user not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or email",
      });
    }

    // Compare entered password with hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Generate JWT Token with additional Info
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role, // check incase of error
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    //Success response with token and expanded user info
    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        bio: user.bio,
        title: user.title,
        experience: user.experience,
        enrolledCourses: user.enrolledCourses.length,
        createdCourses: user.createdCourses.length,
        wishlist: user.wishlist.length,
        socialLinks: user.socialLinks,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong, Please try again later.",
      error: error.message,
    });
  }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    // User Id comes from auth middleware/ where you have the token and expanded user info
    const userId = req.userId;
    const user = await User.findById(userId)
      .select("-password")
      .populate("enrolledCourses", "title thumbnail progress")
      .populate("createdCourses", "title thumbnail progress")
      .populate("wishlist", "title thumbnail progress");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching current user profile",
      error: error.message,
    });
  }
};

//Update User Profile
const updateProfile= async (req, res) => {
  try {
    const userId = req.userId;
    const { firstname, lastname, bio, title, experience, socialLinks } = req.body;
    //Field to be updated
    const updateData = {};
    if (firstname) updateData.firstname = firstname;
    if (lastname) updateData.lastname = lastname;
    if (bio) updateData.bio = bio;
    if (title) updateData.title = title;
    if (experience) updateData.experience = experience;
    if (socialLinks) updateData.socialLinks = socialLinks;

    // Stop users from updating email, username and role automatically

    //Handle profile Image 
    if (req.file) {
      updateData.profileImage = `uploads/${req.file.filename}`;
    };
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {$set: updateData},
      {new: true}
    ).select("-password");
    if(!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    res.status(200).json({
      success: true,
      message:"Profile Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error Updating Profle",
      error: error.message,
    })
  }
};
//Update Password
const updatePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;
    // Validate Input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current Password and New Password are required",
      });
    }
    const user = await User.findById(userId);
    if (!user){
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    // Check if entered current password is correct
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Current Password",
      });
    }
    // Update Password
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message: "Error Updating Password",
      error: error.message,
    })
  }
}
// Export both functions
module.exports = { signup, login, getCurrentUser, updateProfile, updatePassword };
