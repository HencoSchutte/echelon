import asyncHandler from "express-async-handler"
import Product from "../models/productModel.js"
import model from "../config/gemini.js";
import axios from "axios";
import fs from "fs";



const getProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, tags } = req.query
  const filter = {}

  if (category) filter.category = category
  if (minPrice || maxPrice) filter.price = {}
  if (minPrice) filter.price.$gte = Number(minPrice)
  if (maxPrice) filter.price.$lte = Number(maxPrice)
  if (tags) filter.tags = { $all: tags.split(",") }

  const products = await Product.find(filter)
  res.json(products)
})


const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})


const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, tags, image } = req.body
  const product = new Product({ name, description, price, category, tags, image })
  const createdProduct = await product.save()

  try {
    if (image) {
      const form = new FormData();
      form.append("file", fs.createReadStream(`uploads/${image}`));

      const response = await axios.post(
        "http://localhost:8001/embed",
        form,
        { headers: form.getHeaders() }
      );

      product.imageEmbedding = response.data.embedding;
      await product.save();
    }
  } catch (err) {
    console.log("Embedding failed:", err.message);
  }

  res.status(201).json(createdProduct)
})


const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    Object.assign(product, req.body)
    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})




const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne(); 
  res.json({ message: "Product removed" });
});


const smartSearch = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: "Search query required" });
  }

  const lowerQuery = query.toLowerCase();
  let filters = {};

  /* ============================
     Price / Budget
  ============================ */
  const budgetMatch = lowerQuery.match(/under\s?(\d{3,6})/);
  if (budgetMatch) {
    filters.price = { $lte: Number(budgetMatch[1]) };
  }

  /* ============================
     GPU VRAM
  ============================ */
  const vramMatch = lowerQuery.match(/(\d+)\s?gb\s?vram?/);
  if (vramMatch) {
    filters["specifications.vram"] = { $gte: Number(vramMatch[1]) };
  }

  /* ============================
     Storage (SSD / Mobile)
  ============================ */
  const tbMatch = lowerQuery.match(/(\d+)\s?tb/);
  if (tbMatch) filters["specifications.storage"] = { $gte: Number(tbMatch[1]) * 1000 };

  const gbStorageMatch = lowerQuery.match(/(\d+)\s?gb\s?(storage)?/);
  if (gbStorageMatch && !vramMatch) {
    filters["specifications.storage"] = { $gte: Number(gbStorageMatch[1]) };
  }

  /* ============================
     CPU Cores
  ============================ */
  const coresMatch = lowerQuery.match(/(\d+)\s?cores?/);
  if (coresMatch) filters["specifications.cores"] = { $gte: Number(coresMatch[1]) };

  /* ============================
     Brand detection
  ============================ */
  const brands = ["nvidia", "amd", "intel", "apple", "corsair"];
  brands.forEach((b) => {
    if (lowerQuery.includes(b)) filters.brand = b.charAt(0).toUpperCase() + b.slice(1);
  });

  /* ============================
     Category detection
  ============================ */
  if (/\bgpu\b/.test(lowerQuery)) filters.category = "GPU";
  else if (/\bcpu\b/.test(lowerQuery)) filters.category = "CPU";
  else if (/\bram\b/.test(lowerQuery)) filters.category = "RAM";
  else if (/\bmobile\b/.test(lowerQuery) || /\biphone\b/.test(lowerQuery)) filters.category = "Mobile";

  /* ============================
     Performance Tier
  ============================ */
  if (lowerQuery.includes("extreme")) filters.performanceTier = "extreme";
  else if (lowerQuery.includes("high")) filters.performanceTier = "high";
  else if (lowerQuery.includes("mid")) filters.performanceTier = "mid";
  else if (lowerQuery.includes("budget")) filters.performanceTier = "entry";

  /* ============================
     Condition
  ============================ */
  if (lowerQuery.includes("refurbished")) filters.condition = "refurbished";
  else if (lowerQuery.includes("new")) filters.condition = "new";

  /* ============================
     Tags matching
  ============================ */
  const possibleTags = ["gaming", "ai", "workstation", "4k"];
  const matchingTags = possibleTags.filter((t) => lowerQuery.includes(t));
  if (matchingTags.length > 0) filters.tags = { $in: matchingTags };

  /* ============================
     Execute Mongo Query
  ============================ */
  const products = await Product.find(filters);

  res.json({
    filtersApplied: filters,
    results: products,
  });
});

const imageSearch = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }

  const filename = req.file.originalname.toLowerCase();

  // Extract keywords from filename
  const keywords = filename
    .replace(/\.[^/.]+$/, "") // remove extension
    .split(/[-_\s]/);

  // Build regex search
  const regexArray = keywords.map((word) => ({
    $or: [
      { name: { $regex: word, $options: "i" } },
      { brand: { $regex: word, $options: "i" } },
      { category: { $regex: word, $options: "i" } },
      { tags: { $regex: word, $options: "i" } },
    ],
  }));

  const products = await Product.find({
    $or: regexArray,
  }).limit(10);

  res.json({
    uploadedImage: req.file.filename,
    matchedKeywords: keywords,
    results: products,
  });
});



const generateProductSummary = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const prompt = `
You are writing for a premium high-end electronics store called Echelon.

Write a professional, persuasive 3-5 sentence product summary.

Product Name: ${product.name}
Brand: ${product.brand}
Category: ${product.category}
Price: ${product.price}
Condition: ${product.condition}
Performance Tier: ${product.performanceTier}
Specifications: ${JSON.stringify(product.specifications)}

Focus on:
- Performance level
- Target user (enthusiast, professional, gamer)
- Key strengths
Keep it concise and premium.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const summary = response.text();

  res.json({ summary });
});


export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, smartSearch, imageSearch, generateProductSummary }
