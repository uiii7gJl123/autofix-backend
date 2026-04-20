import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.post("/", async(req,res)=>{

 const {userId,name,location,phone} = req.body;

 const result = await pool.query(
 "INSERT INTO workshops(user_id,name,location,phone) VALUES($1,$2,$3,$4) RETURNING *",
 [userId,name,location,phone]
 );

 res.json(result.rows[0]);

});

router.get("/", async(req,res)=>{

 const result = await pool.query("SELECT * FROM workshops");

 res.json(result.rows);

});

export default router;
