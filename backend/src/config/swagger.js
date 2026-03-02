import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           example: 65f1b2c3d4e5f67890123456
 *         name:
 *           type: string
 *           example: Samsung Galaxy S23
 *         description:
 *           type: string
 *           example: Latest Android smartphone with 256GB storage
 *         price:
 *           type: number
 *           example: 15000
 *         category:
 *           type: string
 *           example: Smartphones
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["android", "5G", "256GB"]
 *         image:
 *           type: string
 *           example: "https://example.com/images/galaxy-s23.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Echelon API",
      version: "1.0.0",
      description: "Echelon E-Commerce API Documentation",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/**/*.js"],
}

const swaggerSpec = swaggerJsdoc(options)

export { swaggerUi, swaggerSpec }
