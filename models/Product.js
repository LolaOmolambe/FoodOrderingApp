const mongoose = require("mongoose");


const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    price: {
      type: Number,
    },
    genre: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
