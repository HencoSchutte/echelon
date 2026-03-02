import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";

//
// GET WISHLIST
//
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user.wishlist);
});

//
// ADD TO WISHLIST
//
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const user = await User.findById(req.user._id);

  if (user.wishlist.includes(productId)) {
    res.status(400);
    throw new Error("Product already in wishlist");
  }

  user.wishlist.push(productId);
  await user.save();

  const updatedUser = await User.findById(req.user._id).populate("wishlist");

  res.json(updatedUser.wishlist);
});

//
// REMOVE FROM WISHLIST
//
const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.wishlist = user.wishlist.filter(
    (item) => item.toString() !== req.params.id
  );

  await user.save();

  const updatedUser = await User.findById(req.user._id).populate("wishlist");

  res.json(updatedUser.wishlist);
});

export { getWishlist, addToWishlist, removeFromWishlist };