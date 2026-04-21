import express from "express"
import pool from "../config/db.js"

const router = express.Router()

// GET users
router.get("/", async (req, res) => {
  try {
    const { email } = req.query

    if (email) {
      const result = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        [email]
      )
      return res.json(result.rows)
    }

    const result = await pool.query("SELECT * FROM users")
    res.json(result.rows)

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "server error" })
  }
})

// CREATE user
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, password, roles } = req.body

    const result = await pool.query(
      `INSERT INTO users(name,phone,email,password,roles)
       VALUES($1,$2,$3,$4,$5)
       RETURNING *`,
      [name, phone, email, password, roles || []]
    )

    res.json(result.rows[0])

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "failed to create user" })
  }
})

export default router
