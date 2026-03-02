import asyncHandler from "express-async-handler"
import Order from "../models/orderModel.js"
import Product from "../models/productModel.js"
import Cart from "../models/cartModel.js"

//
// CREATE ORDER (Direct)
//
const createOrder = asyncHandler(async (req, res) => {
  const { products, paymentMethod } = req.body

  if (!products || products.length === 0) {
    res.status(400)
    throw new Error("No products in order")
  }

  let totalPrice = 0
  const orderItems = []

  for (const item of products) {
    const product = await Product.findById(item.product)

    if (!product) {
      throw new Error("Product not found")
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`)
    }

    product.stock -= item.quantity
    await product.save()

    totalPrice += product.price * item.quantity

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    })
  }

  const order = new Order({
    user: req.user._id,
    products: orderItems,
    totalPrice,
    paymentMethod,
  })

  const createdOrder = await order.save()

  res.status(201).json(createdOrder)
})


//
// CHECKOUT (Cart → Order)
//
const checkout = asyncHandler(async (req, res) => {
  const { paymentMethod } = req.body

  if (!paymentMethod) {
    res.status(400)
    throw new Error("Payment method required")
  }

  const cart = await Cart.findOne({ user: req.user._id })

  if (!cart || cart.items.length === 0) {
    res.status(400)
    throw new Error("Cart is empty")
  }

  let totalPrice = 0
  const orderItems = []

  for (const item of cart.items) {
    const product = await Product.findById(item.product)

    if (!product) {
      throw new Error("Product not found")
    }

    if (product.stock < item.quantity) {
      throw new Error(`Insufficient stock for ${product.name}`)
    }

    product.stock -= item.quantity
    await product.save()

    totalPrice += item.price * item.quantity

    orderItems.push({
      product: item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    })
  }

  const order = new Order({
    user: req.user._id,
    products: orderItems,
    totalPrice,
    paymentMethod,
  })

  const createdOrder = await order.save()

  cart.items = []
  await cart.save()

  res.status(201).json(createdOrder)
})


//
// GET LOGGED IN USER ORDERS
//
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  })

  res.json(orders)
})

//
// GET ORDER BY ID (Owner or Admin)
//
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  )

  if (!order) {
    res.status(404)
    throw new Error("Order not found")
  }

  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(401)
    throw new Error("Not authorized")
  }

  res.json(order)
})

//
// ADMIN: GET ALL ORDERS
//
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "name email")
    .sort({ createdAt: -1 })

  res.json(orders)
})

// ADMIN: GET ALL ORDERS WITH FILTERS
const getFilteredOrders = asyncHandler(async (req, res) => {
  // Extract query params
  const { status, paymentMethod, user, startDate, endDate } = req.query

  const query = {}

  if (status) query.status = status
  if (paymentMethod) query.paymentMethod = paymentMethod
  if (user) query.user = user
  if (startDate || endDate) query.createdAt = {}
  if (startDate) query.createdAt.$gte = new Date(startDate)
  if (endDate) query.createdAt.$lte = new Date(endDate)

  const orders = await Order.find(query)
    .populate("user", "name email")
    .sort({ createdAt: -1 })

  res.json(orders)
})


//
// MARK ORDER AS PAID
//
const markOrderAsPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    res.status(404)
    throw new Error("Order not found")
  }

  order.status = "paid"
  order.paidAt = Date.now()

  const updatedOrder = await order.save()

  res.json(updatedOrder)
})

export {
  createOrder,
  checkout,
  getMyOrders,
  getOrderById,
  getAllOrders,
  markOrderAsPaid,
  getFilteredOrders,
}
