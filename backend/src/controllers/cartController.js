import asyncHandler from "express-async-handler"
import Cart from "../models/cartModel.js"
import Product from "../models/productModel.js"

//
// GET MY CART
//
const getMyCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })

  if (!cart) {
    return res.json({ items: [] })
  }

  res.json(cart)
})

//
// ADD TO CART (Stock Protected)
//
const addToCart = asyncHandler(async (req, res) => {
  const { product: productId, quantity } = req.body

  if (!quantity || quantity <= 0) {
    res.status(400)
    throw new Error("Quantity must be greater than 0")
  }

  const product = await Product.findById(productId)

  if (!product) {
    res.status(404)
    throw new Error("Product not found")
  }

  if (product.stock < quantity) {
    res.status(400)
    throw new Error("Not enough stock available")
  }

  let cart = await Cart.findOne({ user: req.user._id })

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] })
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  )

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity

    if (newQuantity > product.stock) {
      res.status(400)
      throw new Error("Not enough stock available")
    }

    existingItem.quantity = newQuantity
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity,
    })
  }

  await cart.save()

  res.json(cart)
})

//
// UPDATE QUANTITY (Stock Protected)
//
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params
  const { quantity } = req.body

  if (!quantity || quantity <= 0) {
    res.status(400)
    throw new Error("Quantity must be greater than 0")
  }

  const cart = await Cart.findOne({ user: req.user._id })

  if (!cart) {
    res.status(404)
    throw new Error("Cart not found")
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  )

  if (!item) {
    res.status(404)
    throw new Error("Item not in cart")
  }

  const product = await Product.findById(productId)

  if (!product) {
    res.status(404)
    throw new Error("Product not found")
  }

  if (quantity > product.stock) {
    res.status(400)
    throw new Error("Not enough stock available")
  }

  item.quantity = quantity

  await cart.save()

  res.json(cart)
})

//
// REMOVE ITEM
//
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params

  const cart = await Cart.findOne({ user: req.user._id })

  if (!cart) {
    res.status(404)
    throw new Error("Cart not found")
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  )

  await cart.save()

  res.json(cart)
})

//
// CLEAR CART
//
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })

  if (!cart) {
    res.status(404)
    throw new Error("Cart not found")
  }

  cart.items = []
  await cart.save()

  res.json({ message: "Cart cleared" })
})

export {
  getMyCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
}
