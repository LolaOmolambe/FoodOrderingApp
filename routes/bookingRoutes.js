const express = require("express");

const bookingController = require("../controllers/bookingController");
const authControllers = require("../controllers/authController");

const router = express.Router();

router.get('/checkout-session/:orderId', bookingController.getCheckoutSession);

module.exports = router;