const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//creating how user information will be stored in the database

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  //New fields for enhancing the user schema
  role: {
    type: String,
    default: "student",
    enum: ["student", "instructor", "admin"],
  },
  profileImage: {
    type: String,
    default: "/images/default-avatar.png",
  },
  bio: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  experience: {
    type: String,
    default: "",
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    linkedin: String,
    github: String,
    website: String,
  },
  //Some things related to user to track the courses they enrolled in  or that they are the tutor of
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    }
  ],
  //Track User Created Course
  createdCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
     ref: "Course",}
  ],
  //Track User Wishlist Course
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
     ref: "Course",}
  ],
},
{
  timeStamp: true,
});
// hash users password
userSchema.pre("save", async function (next) {
  // only hash the password if it's been modified
  if (!this.isModified("password")) return next();
  try{
    this.password = await bcrypt.hash(this.password, 10);
  next();
}
  catch(error) {
    next(error);
  }
});


//Compare Passwords
userSchema.methods.comparePasswords = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Method to get Fullname
userSchema.methods.getFullName = function(){
retun `${this.firstname} ${this.lastname}`
};
//Function to check how many course an Instructor has
userSchema.virtual("courseCount").get(function()
{
  return this.createdCourses?.length || 0;
});

const User = mongoose.model("User", userSchema);
module.exports = User;
