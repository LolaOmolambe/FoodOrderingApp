const express = require("express");
const authController = require("./../controllers/authController");
const router = express.Router();
const passport = require("passport");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/googlelogin", authController.googleSignIn);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch(
  "/updatepassword",
  authController.protectRoutes,
  authController.updatePassword
);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    res.send("Hello");
  }
);

module.exports = router;
