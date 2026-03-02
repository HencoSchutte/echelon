import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    costPrice: {
      type: Number, // for reporting/profit calculation
      required: true,
    },
    stock: {
      type: Number,
      default: 1,
    },
    condition: {
      type: String,
      enum: ["new", "refurbished"],
      required: true,
      default: "new",
    },
    refurbGrade: {
      type: String,
      enum: ["A", "B", "C"],
      default: "A",
    },
    performanceTier: {
      type: String,
      enum: ["entry", "mid", "high", "extreme"],
      default: "high",
    },
    warrantyMonths: {
      type: Number,
      default: 12,
    },
    tags: [String], // Free-hand tags for filtering & searching
    specifications: {
      type: Object, // Flexible JSON for CPU/GPU/motherboard/etc.
      default: {},
    },
    images: [String], // URLs to product images
    description: {
      type: String,
      trim: true,
    },
    imageEmbedding: {
    type: [Number], // vector from CLIP
    default: [],
}

  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
