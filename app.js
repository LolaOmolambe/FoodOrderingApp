const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
var cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();
require("dotenv").config();

const mongoURI =
  process.env.NODE_ENV !== "test"
    ? process.env.MONGO_ATLAS_PW
    : process.env.MONGO_ATLAS_TEST;

mongoose.connect(mongoURI, { useNewUrlParser: true });
mongoose.connection.on("connected", () => {
  console.log("MongoDB connection established successfully");
});
mongoose.connection.on("error", (err) => {
  console.log("MongoDB connection error. Please make sure MongoDB is running.");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});
app.use(cors());

app.use("/api/user", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/admin", reportRoutes);

module.exports = app;
