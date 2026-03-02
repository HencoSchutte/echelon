import dotenv from "dotenv"
dotenv.config({ path: "./.env" })
import connectDB from "./src/config/db.js"
import app from "./src/app.js"
import orderRoutes from "./src/routes/orderRoutes.js"
import wishlistRoutes from "./src/routes/wishlistRoutes.js";


// Connect to MongoDB
connectDB()

// Mount routes
app.use("/api/orders", orderRoutes)
app.use("/api/wishlist", wishlistRoutes);

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Echelon API running on port ${PORT}`)
  console.log(`📘 Swagger Docs available at: http://localhost:${PORT}/api-docs`)
})
