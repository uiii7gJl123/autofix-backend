import express from "express";
import {
  createOrder,
  getOrders,
  updateOrderStatus
} from "../models/Order.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { clientId, workshopId, type, description } = req.body;

  const order = await createOrder(
    clientId,
    workshopId,
    type,
    description
  );

  res.json(order);
});

router.get("/", async (req, res) => {
  const orders = await getOrders();
  res.json(orders);
});

router.put("/:id", async (req, res) => {
  const { status } = req.body;
  const order = await updateOrderStatus(req.params.id, status);
  res.json(order);
});

export default router;
