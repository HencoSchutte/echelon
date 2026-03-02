import express from "express";
import { getFinancialReport, getProductReport, getCustomerReport, } from "../controllers/reportController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Admin Reports
 */

/**
 * @swagger
 * /api/reports/financial:
 *   get:
 *     summary: Get financial report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Financial summary
 */
router.get("/financial", protect, admin, getFinancialReport);

/**
 * @swagger
 * /api/reports/products:
 *   get:
 *     summary: Get product performance report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product report data
 */
router.get("/products", protect, admin, getProductReport);

/**
 * @swagger
 * /api/reports/customers:
 *   get:
 *     summary: Get customer performance report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer report data
 */
router.get("/customers", protect, admin, getCustomerReport);



export default router;
