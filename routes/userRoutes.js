const express = require("express");
const userController = require("../controllers/userController");
const authControllers = require("../controllers/authController");

const router = express.Router();

router.get(
  "/getallusers",
  //authControllers.protectRoutes,
  //authControllers.restrictTo("admin"),
  userController.getAllUsers
);

router.get("/deactivateuser/:id", userController.deleteUser);
router.get("/reactivateuser/:id", userController.activateUser);

module.exports = router;