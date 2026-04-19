import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import partRoutes from "./routes/partRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/parts", partRoutes);

app.get("/", (req, res) => {
  res.send("AutoFix API running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
