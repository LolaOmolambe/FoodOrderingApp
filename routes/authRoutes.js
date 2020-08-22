const express = require("express");
const authController = require("./../controllers/authController");
const router = express.Router();

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

module.exports = router;
