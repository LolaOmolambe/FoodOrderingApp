const express = require("express");
const userController = require("../controllers/userController");
const authControllers = require("../controllers/authController");

const router = express.Router();

router.get(
  "/getallusers",
  authControllers.protectRoutes,
  authControllers.restrictTo("admin"),
  userController.getAllUsers
);

router.get("/deactivateuser/:id", userController.deleteUser);
router.get("/reactivateuser/:id", userController.activateUser);

router.get("", authControllers.protectRoutes, userController.getUser);
router.patch(
  "/updateMe",
  authControllers.protectRoutes,
  userController.updateMe
);
// router.patch(
//   "/updatepassword",
//   authControllers.protectRoutes,
//   authControllers.updatePassword
// );

module.exports = router;
