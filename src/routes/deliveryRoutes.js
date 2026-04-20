import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.post("/request", async(req,res)=>{

 const {orderId,driverId} = req.body;

 const result = await pool.query(
 "INSERT INTO deliveries(order_id,driver_id) VALUES($1,$2) RETURNING *",
 [orderId,driverId]
 );

 res.json(result.rows[0]);

});

router.get("/", async(req,res)=>{

 const result = await pool.query("SELECT * FROM deliveries");

 res.json(result.rows);

});

export default router;
