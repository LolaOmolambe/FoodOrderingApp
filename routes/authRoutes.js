const express = require("express");
const authController = require("./../controllers/authController");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;



router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get("/auth/google/callback", passport.authenticate("google"));

module.exports = router;
