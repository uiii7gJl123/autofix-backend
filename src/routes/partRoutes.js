import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.post("/", async(req,res)=>{

 const {distributorId,name,price,stock} = req.body;

 const result = await pool.query(
 "INSERT INTO parts(distributor_id,name,price,stock) VALUES($1,$2,$3,$4) RETURNING *",
 [distributorId,name,price,stock]
 );

 res.json(result.rows[0]);

});

router.get("/", async(req,res)=>{

 const result = await pool.query("SELECT * FROM parts");

 res.json(result.rows);

});

export default router;
