import mongoose from "mongoose"

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true }, // snapshot
    price: { type: Number, required: true }, // snapshot
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [orderItemSchema],

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "paypal"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "complete"],
      default: "pending",
    },

    paidAt: Date,
  },
  { timestamps: true }
)

const Order = mongoose.model("Order", orderSchema)

export default Order
