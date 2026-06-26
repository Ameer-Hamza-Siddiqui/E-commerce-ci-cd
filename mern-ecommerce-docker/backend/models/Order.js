const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [
      {
        name: String,
        quantity: Number,
        price: Number,
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
      }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "Pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
