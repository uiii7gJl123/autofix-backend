import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/", async(req,res)=>{

 const result = await pool.query("SELECT id,name,phone,role FROM users");

 res.json(result.rows);

});

export default router;
