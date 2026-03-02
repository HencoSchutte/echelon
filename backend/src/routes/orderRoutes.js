import express from "express"
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  markOrderAsPaid,
  checkout,
  getFilteredOrders,
} from "../controllers/orderController.js"
import { protect, admin } from "../middleware/authMiddleware.js"

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Manage orders
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *               - paymentMethod
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - product
 *                     - quantity
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: Product ID
 *                     quantity:
 *                       type: number
 *                       example: 2
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card, paypal]
 *                 example: card
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: No products in order
 */

/**
 * @swagger
 * /api/orders/myorders:
 *   get:
 *     summary: Get logged-in user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID (owner or admin)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       403:
 *         description: Admin access only
 */

/**
 * @swagger
 * /api/orders/filter:
 *   get:
 *     summary: Get all orders with filters (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, complete, paid]
 *         description: Filter by order status
 *       - in: query
 *         name: paymentMethod
 *         schema:
 *           type: string
 *           enum: [cash, card, paypal]
 *         description: Filter by payment method
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter orders created after this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter orders created before this date
 *     responses:
 *       200:
 *         description: List of filtered orders
 *       403:
 *         description: Admin access only
 */


/**
 * @swagger
 * /api/orders/{id}/pay:
 *   put:
 *     summary: Mark order as paid
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order marked as paid
 *       404:
 *         description: Order not found
 */

router.post("/", protect, createOrder)
router.post("/checkout", protect, checkout)

// Specific GET routes first
router.get("/myorders", protect, getMyOrders)
router.get("/filter", protect, admin, getFilteredOrders)
router.get("/", protect, admin, getAllOrders)

// Dynamic routes AFTER specific ones
router.get("/:id", protect, getOrderById)
router.put("/:id/pay", protect, markOrderAsPaid)



export default router
