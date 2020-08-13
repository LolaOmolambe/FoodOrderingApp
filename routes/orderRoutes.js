const express = require("express");

const orderController = require("../controllers/orderController");
const authControllers = require("../controllers/authController");

const router = express.Router();

router.post("", authControllers.protectRoutes, orderController.createOrder);

module.exports = router;