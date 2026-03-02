import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import multer from "multer";
import path from "path";
import Product from "../models/productModel.js";

// Cosine similarity
const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
};

// Image search controller
export const imageSearch = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path));

    // Call your embedding service
    const response = await axios.post("http://localhost:8001/embed", form, {
      headers: form.getHeaders(),
    });

    const queryEmbedding = response.data.embedding;

    const products = await Product.find({ imageEmbedding: { $exists: true, $ne: [] } });

    const scored = products.map((product) => ({
      product,
      similarity: cosineSimilarity(queryEmbedding, product.imageEmbedding),
    }));

    scored.sort((a, b) => b.similarity - a.similarity);

    res.json(scored.slice(0, 10));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Multer storage & file filter
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) cb(null, true);
  else cb(new Error("Images only!"));
};

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => checkFileType(file, cb),
});

export default upload;
