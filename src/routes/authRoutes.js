import express from "express";
import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async(req,res)=>{

 const {name,phone,password,role} = req.body;

 const hash = await bcrypt.hash(password,10);

 const result = await pool.query(
 "INSERT INTO users(name,phone,password,role) VALUES($1,$2,$3,$4) RETURNING *",
 [name,phone,hash,role]
 );

 res.json(result.rows[0]);

});

router.post("/login", async(req,res)=>{

 const {phone,password} = req.body;

 const result = await pool.query(
 "SELECT * FROM users WHERE phone=$1",
 [phone]
 );

 if(result.rows.length===0) return res.status(401).json({error:"user not found"});

 const user = result.rows[0];

 const valid = await bcrypt.compare(password,user.password);

 if(!valid) return res.status(401).json({error:"wrong password"});

 const token = jwt.sign(
 {id:user.id,role:user.role},
 process.env.JWT_SECRET
 );

 res.json({token});

});

export default router;
