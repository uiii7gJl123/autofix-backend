import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.post("/", async(req,res)=>{

 const {clientId,vehicleId,workshopId,description} = req.body;

 const result = await pool.query(
 "INSERT INTO orders(client_id,vehicle_id,workshop_id,description) VALUES($1,$2,$3,$4) RETURNING *",
 [clientId,vehicleId,workshopId,description]
 );

 res.json(result.rows[0]);

});

router.get("/", async(req,res)=>{

 const result = await pool.query(
 "SELECT * FROM orders ORDER BY created_at DESC"
 );

 res.json(result.rows);

});

router.put("/:id/status", async(req,res)=>{

 const {status} = req.body;

 const result = await pool.query(
 "UPDATE orders SET status=$1 WHERE id=$2 RETURNING *",
 [status,req.params.id]
 );

 res.json(result.rows[0]);

});

export default router;
