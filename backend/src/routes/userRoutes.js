import express from "express"
import { registerUser, authUser, getUserProfile } from "../controllers/userController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()


/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     description: Returns the profile of the authenticated user. Requires JWT Bearer token.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 65f1a2b3c4d5e6f7890abcd1
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john@echelon.com
 *                 role:
 *                   type: string
 *                   example: customer
 *       401:
 *         description: Not authorized, invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not authorized, token failed
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 */


/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authenticate user and return JWT
 *     description: Logs in a registered user using email and password and returns a JWT token.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@echelon.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 65f1a2b3c4d5e6f7890abcd1
 *                 name:
 *                   type: string
 *                   example: Test User
 *                 email:
 *                   type: string
 *                   example: test@echelon.com
 *                 role:
 *                   type: string
 *                   example: customer
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and returns a JWT token upon successful registration.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@echelon.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 65f1a2b3c4d5e6f7890abcd1
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   example: john@echelon.com
 *                 role:
 *                   type: string
 *                   example: customer
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: User already exists or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User already exists
 *       500:
 *         description: Server error
 */


router.get("/profile", protect, getUserProfile)
router.post("/register", registerUser)
router.post("/login", authUser)

export default router
