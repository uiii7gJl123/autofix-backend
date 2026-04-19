import express from "express";
import { createUser, getUsers } from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, phone, role } = req.body;
  const user = await createUser(name, phone, role);
  res.json(user);
});

router.get("/", async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

export default router;
