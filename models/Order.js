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
      default: "Pending",
      enum: ["Pending","Paid", "Processing", "Completed", "Cancelled"],
    },
    grandTotal: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);


