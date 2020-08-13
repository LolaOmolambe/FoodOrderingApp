const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "processing", "completed"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
