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

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("AutoFix API running")
})

app.use("/users", userRoutes)
app.use("/auth", authRoutes)
app.use("/orders", orderRoutes)
app.use("/parts", partRoutes)
app.use("/vehicles", vehicleRoutes)
app.use("/workshops", workshopRoutes)
app.use("/delivery", deliveryRoutes)

const PORT = process.env.PORT || 10000

app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})
