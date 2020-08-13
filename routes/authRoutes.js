const express = require("express");
const authController = require("./../controllers/authController");
const router = express.Router();
const passport = require("passport");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

console.log("authRoutes");
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
 
);

router.get("/auth/google/callback", passport.authenticate("google"));

module.exports = router;
