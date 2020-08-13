const express = require("express");
const productController = require("../controllers/productController");
const authControllers = require("../controllers/authController");

const extractFile = require("../services/file");

const router = express.Router();

router.post(
  "",
  authControllers.protectRoutes,
  authControllers.restrictTo("admin"),
  extractFile,
  productController.createProduct
);

router.get("", productController.getProducts);

router.put(
  "/:id",
   authControllers.protectRoutes,
   authControllers.restrictTo("admin"),
  productController.updateProduct
);

router.delete(
  "/:id",
  authControllers.protectRoutes,
  authControllers.restrictTo("admin"),
  productController.deleteProduct
);

router.get("/:id", productController.getProduct);

module.exports = router;
