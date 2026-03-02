import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

// @desc    Create new category
// @route   POST /api/categories
// @access  Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Category name required");
  }
  const category = new Category({ name });
  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  category.name = req.body.name || category.name;
  const updatedCategory = await category.save();
  res.json(updatedCategory);
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  await category.deleteOne();
  res.json({ message: "Category removed" });
});

export { getCategories, createCategory, updateCategory, deleteCategory };