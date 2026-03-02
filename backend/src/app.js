import express from "express"
import cors from "cors"
import errorHandler from "./middleware/errorMiddleware.js"
import healthRoutes from "./routes/healthRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import { swaggerUi, swaggerSpec } from "./config/swagger.js"
import orderRoutes from "./routes/orderRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import reportRoutes from "./routes/reportRoutes.js"
import path from "path";




const app = express()


// Parse incoming JSON
app.use(express.json())

// Parse URL-encoded data 
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Health check ,proves server is alive and reachable
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use("/api/health", healthRoutes)
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/reports", reportRoutes);
app.use("/uploads", express.static(path.resolve("uploads")));
app.use(errorHandler)


export default app
