const express = require("express");

const orderController = require("../controllers/orderController");
const authControllers = require("../controllers/authController");

const router = express.Router();

router.post("", authControllers.protectRoutes, orderController.createOrder);
router.get("", authControllers.protectRoutes, orderController.getAllOrders);
router.get("/myOrders", authControllers.protectRoutes, orderController.getMyOrders);
module.exports = router;