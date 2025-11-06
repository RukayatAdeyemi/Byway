const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {signup, login, getCurrentUser, updateProfile, updatePassword} = require("./../controllers/authController");

// Declare the validation rules
const {
  signupValidationRules,
  validate,
  loginValidationRules,
  profileUpdateValidationRules,
  passwordUpdateValidationRules,
} = require("../validators//authValidators");
const authMiddleware= require("../middleware/authMiddleware");

//Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, "uploads/profile-images/");
  },
  filename: function (req, file, cb) {
    cb(null, `user-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  //Accept only Images
  if(file.mimetype.startsWith("image/")){
    cb(null, true);
  } else {
      cb(new Error("Not an image!, Please upload onlu images"))
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2, //limit to 2mb 
  },
  fileFilter: fileFilter,
});

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - phone
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 example: password123
 *               phone:
 *                 type: string
 *                 example: 1234567890
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully!
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64f1b2c8e4b0f5a3d4f5e6a7
 *                     username:
 *                       type: string
 *                       example: john_doe
 *                     phone:
 *                       type: string
 *                       example: 1234567890
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *       400:
 *         description: Invalid input or user already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful!
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64f1b2c8e4b0f5a3d4f5e6a7
 *                     username:
 *                       type: string
 *                       example: john_doe
 *                     phone:
 *                       type: string
 *                       example: 1234567890
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid username or password
 *       500:
 *         description: Server error
 */

router.post("/signup", signupValidationRules, validate, signup);
router.post("/login", loginValidationRules, validate, login);

// Protected routes that requires authentication
router.get("/profile", authMiddleware, getCurrentUser);
router.put(
  "/profile",
  authMiddleware,
  validate,
  updateProfile
);


module.exports = router;
