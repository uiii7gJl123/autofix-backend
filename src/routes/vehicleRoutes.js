import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.post("/", async(req,res)=>{

 const {userId,brand,model,year,plate} = req.body;

 const result = await pool.query(
 "INSERT INTO vehicles(user_id,brand,model,year,plate) VALUES($1,$2,$3,$4,$5) RETURNING *",
 [userId,brand,model,year,plate]
 );

 res.json(result.rows[0]);

});

router.get("/:userId", async(req,res)=>{

 const result = await pool.query(
 "SELECT * FROM vehicles WHERE user_id=$1",
 [req.params.userId]
 );

 res.json(result.rows);

});

export default router;
