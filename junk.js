
 mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("connected to MongoDB");
    }).catch(error => {console.log("Error", error)});
    


    // Authcontroller junk 
 try {
    const { firstname, lastname, username, email, password } = req.body;
    //Check if existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      //Username
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }
    // Create a new user
    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      password,
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
      },
    });
  } catch (error) {
    console.log("Signup Error:", error);
    res.status(500).json({ message: "Error signing up users" });
  };

  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      //find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Email or Password" });
      }
      // compare password with the one saved in database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Email or Password" });
      }
      //Generate token when user signin
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "2d",
      });
      res.json({
        success: true,
        message: "Login successful!",
        token,
        user: {
          id: user._id,
          firstname: user.firstname,
          lasule.exports = {
//   signupValidationRules,
//   loginValidationRules,
//   validate,
// };tname: user.lastname,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      console.log("Login Error:", error);
      res.status(500).json({ message: "Error occur while Logging in" }); //login error
    }
  };



  const signupValidationRules = [
    //Firstname Validation
    body("firstname")
      .trim()
      .notEmpty()
      .withMessage("Firstname is required")
      .matches(/^[A-Za-z]+$/)
      .withMessage("Firstname must contain only letters")
      .isLength({ min: 3, max: 30 })
      .withMessage("Firstname must be 3 to 30 characters"),
  
    //Lastname Validation
    body("lastname")
      .trim()
      .notEmpty()
      .withMessage("Lastname is required")
      .matches(/^[A-Za-z]+$/)
      .withMessage("Lastname must contain only letters")
      .isLength({ min: 3, max: 30 })
      .withMessage("Lastname must be 3 to 30 characters"),
  
    //Username Validation
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isAlphanumeric()
      .withMessage("Username must be Alphanumeric")
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be 3 to 30 characters"),
  
    //Email Validation
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please enter a valid email address"),
  
    // Password Validation
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 9 })
      .withMessage("Password must be at least 9 characters"),
  ];


  const loginValidationRules = [
    //Email Validation
    body("email").trim().notEmpty().withMessage("Email is required"),
    // Password Validation
    body("password").trim().notEmpty().withMessage("Password is required"),
  ];
  
  //Validation middleware
  const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, errors: errors.array().map((err) => err.msg) });
    }
    next();
  };
  module.exports = {
    signupValidationRules,
    loginValidationRules,
    validate,
  };
  
  