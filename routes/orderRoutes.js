const express = require("express");

const orderController = require("../controllers/orderController");
const authControllers = require("../controllers/authController");

const router = express.Router();

router.post("", authControllers.protectRoutes, orderController.createOrder);
router.get("", authControllers.protectRoutes, orderController.getAllOrders);
router.get("/myOrders", authControllers.protectRoutes, orderController.getMyOrders);

router.get('/checkout-session/:orderId', authControllers.protectRoutes, orderController.getCheckoutSession);

router.put('/:orderId', orderController.updateOrderStatus);

router.get("/:orderId", authControllers.protectRoutes, orderController.getOrder);


module.exports = router;








