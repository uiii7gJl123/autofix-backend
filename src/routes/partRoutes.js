import express from "express";
import { createPart, getParts } from "../models/Part.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, price, stock, distributorId } = req.body;

  const part = await createPart(
    name,
    price,
    stock,
    distributorId
  );

  res.json(part);
});

router.get("/", async (req, res) => {
  const parts = await getParts();
  res.json(parts);
});

export default router;
