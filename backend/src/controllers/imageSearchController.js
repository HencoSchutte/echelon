import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";

// Cosine similarity helper
const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
};

// Image search handler
export const imageSearch = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No image uploaded" });

  try {
    // Send uploaded image to embedding service
    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path));

    const response = await axios.post("http://localhost:8001/embed", form, {
      headers: form.getHeaders(),
    });

    const queryEmbedding = response.data.embedding;

    // Fetch products with embeddings
    const products = await Product.find({ imageEmbedding: { $exists: true, $ne: [] } });

    // Calculate similarity
    const scored = products.map((p) => ({
      product: p,
      similarity: cosineSimilarity(queryEmbedding, p.imageEmbedding),
    }));

    // Sort descending by similarity
    scored.sort((a, b) => b.similarity - a.similarity);

    res.json(scored.slice(0, 10));
  } catch (err) {
    console.log("Image search error:", err.message);
    res.status(500).json({ message: "Failed to search by image" });
  }
});