const crypto = require("crypto");
const User = require("./../models/User");
const jwt = require("jsonwebtoken");
//const { promisify } = require("util");

//const sendEmail = require("../services/email");
const Email = require("../services/email");

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
    const url = `${req.protocol}://${req.get("host")}/me`;
    console.log(url);
    //await new Email(newUser, url).sendWelcome();

    const token = signToken(newUser._id);

    //Send to user
    let message = "Welcome on Board";

    // await sendEmail({
    //   email: req.body.email,
    //   subject: "Welcome to VegeFoods, we're glad to have you",
    //   message,
    // });
    await new Email(newUser, url).sendWelcome();

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Invalid Authorization Credentials",
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  //console.log(req.body);

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

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }

    //If everything is fine, send token to client
    //const token = signToken(user._id);
    const token = signToken(user);
    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      //secure: true,
      httpOnly: true,
    });

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
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    console.log(decodedToken);

    //Check if user still exists
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({
        message: "The user belonging to this token no longer exists",
      });
    }

    //Check if user changed password after the token was issued
    if (user.changePasswordAfter(decodedToken.iat)) {
      return res.status(401).json({
        message: "The user recently changed password, pls login again",
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
        message: "Not authorized to perform this action",
      });
    }
    next();
  };
};

exports.forgotPassword = async (req, res, next) => {
  //Get user baed on Posted email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({
      message: "No user with this email address",
    });
  }

  //Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //Send to the user email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}api/user/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password
  and passwordConfirm to : ${resetURL}.\nIf you didn't forget your password,
  please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset Token (valid for 10 min",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to the email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({
      status: "error",
      message: "There was an error sending the email, Try again",
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  //Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //If token has not expired, and there is user, set the new password
  if (!user) {
    return res.status(400).json({
      message: "Token is invalid or has expired",
    });
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //Update the changePasswordAt for the user

  //Log the user in, send JWT
  const token = signToken(user);

  return res.status(200).json({
    status: "success",
    token: token,
    expiresIn: 3600,
    userId: user._id,
    userRole: user.role,
  });
};

exports.updatePassword = async (req, res, next) => {
  //Get user from collection
  const user = await User.findById(req.userData.userId).select("+password");

  //Check if current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    res.status(401).json({ message: "Your current password is wrong" });
  }

  //If sp, Update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //Log user in, send jwt
  const token = signToken(user);
  return res.status(200).json({
    status: "success",
    token: token,
    expiresIn: 3600,
    userId: user._id,
    userRole: user.role,
  });
};

exports.googleSignIn = async (req, res, next) => {
  const { email, firstName, lastName } = req.body;
  console.log(email, firstName, lastName);
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const token = signToken(existingUser);
    return res.status(200).json({
      status: "success",
      token: token,
      expiresIn: 3600,
      userId: existingUser._id,
      userRole: existingUser.role,
    });
  } else {
    try {
      const user = await new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
      }).save({ validateBeforeSave: false });
      
      const url = `${req.protocol}://${req.get("host")}/me`;
      console.log(url);

      await new Email(user, url).sendWelcome();

      let token = signToken(user);
      return res.status(200).json({
        status: "success",
        token: token,
        expiresIn: 3600,
        userId: user._id,
        userRole: user.role,
      });
    } catch (err) {
      res.status(500).json({
        message: "Authentication failed!",
      });
    }
  }
};
