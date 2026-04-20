import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import workshopRoutes from "./routes/workshopRoutes.js";
import partRoutes from "./routes/partRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/workshops", workshopRoutes);
app.use("/parts", partRoutes);
app.use("/orders", orderRoutes);
app.use("/delivery", deliveryRoutes);

app.get("/", (req,res)=>{
 res.send("AutoFix API running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
 console.log("Server running on port " + PORT);
});
