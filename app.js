const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
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

  module.exports = app;