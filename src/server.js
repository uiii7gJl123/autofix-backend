import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import partRoutes from "./routes/partRoutes.js"
import vehicleRoutes from "./routes/vehicleRoutes.js"
import workshopRoutes from "./routes/workshopRoutes.js"
import deliveryRoutes from "./routes/deliveryRoutes.js"

dotenv.config()

const app = express()

// مهم جدًا لبعض بيئات الإنتاج
app.set("trust proxy", 1)

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "AutoFix API running"
  })
})

// Routes
app.use("/users", userRoutes)
app.use("/auth", authRoutes)
app.use("/orders", orderRoutes)
app.use("/parts", partRoutes)
app.use("/vehicles", vehicleRoutes)
app.use("/workshops", workshopRoutes)
app.use("/delivery", deliveryRoutes)

// 404 handler (مهم جدًا)
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  })
})

// Error handler (يحمي السيرفر من الانهيار)
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err)
  res.status(500).json({
    error: "Internal server error"
  })
})

const PORT = process.env.PORT || 10000

app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})
