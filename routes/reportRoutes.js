const express = require("express");
const authControllers = require("../controllers/authController");
const reportController = require("../controllers/reportController");

const router = express.Router();


router.get(
  "/adminreport",
   authControllers.protectRoutes,
   authControllers.restrictTo("admin"),
  reportController.statistics
);

module.exports = router;




