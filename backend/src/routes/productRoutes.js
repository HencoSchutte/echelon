import express from "express"
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  smartSearch,
  generateProductSummary,
} from "../controllers/productController.js"
import { protect, admin } from "../middleware/authMiddleware.js"; 
import { imageSearch } from "../controllers/imageSearchController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and retrieval
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of products. Supports filtering by category, price range, and tags.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by product category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated product tags to filter
 *     responses:
 *       200:
 *         description: List of products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve a single product by its unique ID.
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get("/:id", getProductById)

/**
 * @swagger
 * /api/products/smart-search:
 *   post:
 *     summary: Smart natural language product search
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - query
 *             properties:
 *               query:
 *                 type: string
 *                 example: I need a GPU under 15000 with 12GB VRAM for gaming
 *     responses:
 *       200:
 *         description: Matching products returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 filtersApplied:
 *                   type: object
 *                   description: Filters derived from natural language query
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       brand:
 *                         type: string
 *                       category:
 *                         type: string
 *                       price:
 *                         type: number
 *                       specifications:
 *                         type: object
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                       description:
 *                         type: string
 */
router.post("/smart-search", smartSearch);



/**
 * @swagger
 * /api/products/{id}/ai-summary:
 *   get:
 *     summary: Generate AI summary for a product using Gemini
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: AI-generated summary
 *       404:
 *         description: Product not found
 */
router.get("/:id/ai-summary", generateProductSummary);


/**
 * @swagger
 * /api/products/image-search:
 *   post:
 *     summary: Search products using an uploaded image
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Similar products found
 *       400:
 *         description: No image uploaded
 */
router.post("/image-search", upload.single("image"), imageSearch);






// Admin-only routes
/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     description: Update an existing product by ID. Admin access required.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               countInStock:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid data
 *       403:
 *         description: Admin access only
 *       404:
 *         description: Product not found
 */
router.put("/:id", protect, admin, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Delete an existing product by ID. Admin access required.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       403:
 *         description: Admin access only
 *       404:
 *         description: Product not found
 */
router.delete("/:id", protect, admin, deleteProduct);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: Admin can create a new product. Admin access required.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *               - brand
 *               - costPrice
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Gaming GPU"
 *               brand:
 *                 type: string
 *                 example: "NVIDIA"
 *               price:
 *                 type: number
 *                 example: 15999
 *               costPrice:
 *                 type: number
 *                 example: 12000
 *               category:
 *                 type: string
 *                 example: "Graphics Cards"
 *               description:
 *                 type: string
 *                 example: "High-end GPU for gaming and AI tasks"
 *               countInStock:
 *                 type: number
 *                 example: 10
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["GPU", "Gaming", "VRAM 12GB"]
 *               image:
 *                 type: string
 *                 example: "https://example.com/images/gpu.jpg"
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Admin access only
 */
router.post("/", protect, admin, createProduct);

export default router
