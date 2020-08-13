const User = require("./../models/User");
const jwt = require("jsonwebtoken");
//const { promisify } = require("util");

const sendEmail = require("../services/email");

const signToken = (user) => {
  console.log("here");
  return jwt.sign(
    { email: user.email, userId: user._id, role: user.role },

    process.env.JWT_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

exports.signup = async (req, res, next) => {
  try {
    //console.log(req.body);
    const newUser = await User.create(req.body);
    console.log(newUser);
    const token = signToken(newUser._id);

    //Send to user
    let message = "Welcome on Board";

    await sendEmail({
      email: req.body.email,
      subject: "Welcome",
      message,
    });

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Invalid Authorization Credentials",
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  //Chack if email and password exits
  if (!email || !password) {
    //throw an error
    return res.status(400).json({
      message: "Provide email and password",
    });
  }
  try {
    //check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password");
    //console.log(user);
    //const passwordCorrect = await user.correctPassword(password, user.password);
    //console.log(passwordCorrect);
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }

    //If everything is fine, send token to client
    //const token = signToken(user._id);
    const token = signToken(user);
    return res.status(200).json({
      status: "success",
      token: token,
      expiresIn: 3600,
      userId: user._id,
      userRole: user.role,
    });
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Auth Details",
    });
  }
};

exports.protectRoutes = async (req, res, next) => {
  //Get token and check if it is there
  let token;
  if (
    req.headers.authorization
    && req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    //console.log(token);
  }
  if (!token) {
    return res.status(401).json({ message: "You are not authenticated" });
  }

  try {
    //Verify token
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    //console.log(decodedToken);

    //Check if user still exists
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({
        message: "Token for this user no longer exists",
      });
    }

    req.user = user;
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId,
      userRole: decodedToken.role,
    };

    next();
  } catch (err) {
    //handle expired session later
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles is an array
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      message: "No user with this email address",
    });
  }
  //Come back to this
};
