const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
require('./services/passport');

const app = express();
mongoose
.connect(process.env.MONGO_ATLAS_PW).then(() => {
  console.log("Connected to DB  ");
})
.catch(() => {
  console.log("Connection failed");
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

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

  
  app.use("/api/user", authRoutes);
  app.use("/api/product", productRoutes);

  module.exports = app;