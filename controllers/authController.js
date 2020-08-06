const User = require("./../models/User");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const signToken = (id) => {
  return jwt.sign(
    { id },

    process.env.JWT_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    const token = signToken(newUser._id);

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
    const token = signToken(user._id);
    return res.status(200).json({
      status: "sucess",
      token,
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
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "You are not authenticated" });
  }

  try {
    //Verify token
    const decodedToken = await promisify(jwt.verify)(token, process.env.KEY);

    //Check if user still exists
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(401).json({
        message: "Token for this user no longer exists",
      });
    }

    req.user = user;
    //Check if user changed password after login

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

