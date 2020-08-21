const express = require("express");
const productController = require("../controllers/productController");
const authControllers = require("../controllers/authController");
const reportController = require("../controllers/reportController");

const extractFile = require("../services/file");
require("../services/cloudinary.config");
const upload = require("../services/multer");

const router = express.Router();

// router.post(
//   "",
//   authControllers.protectRoutes,
//   authControllers.restrictTo("admin"),
//   extractFile,
//   productController.createProduct
// );

router.post(
  "",
  authControllers.protectRoutes,
  authControllers.restrictTo("admin"),
  upload.single("image"),
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
router.post("/productsbygenre", productController.getProductsByCategory);

// router.get(
//   "/adminreport",
//   // authControllers.protectRoutes,
//   // authControllers.restrictTo("admin"),
//   reportController.statistics
// );

module.exports = router;


