import express from "express"
import pool from "../config/db.js"

const router = express.Router()

// GET users (all or by email)
router.get("/", async (req, res) => {
  try {
    const { email } = req.query

    if (email) {
      const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      )

      const formatted = result.rows.map(u => ({
        ...u,
        roles: u.roles ? JSON.parse(u.roles) : []
      }))

      return res.json(formatted)
    }

    const result = await pool.query("SELECT * FROM users")

    const formatted = result.rows.map(u => ({
      ...u,
      roles: u.roles ? JSON.parse(u.roles) : []
    }))

    res.json(formatted)

  } catch (err) {
    console.error("GET USERS ERROR:", err)
    res.status(500).json({
      error: err.message,
      code: err.code
    })
  }
})


// CREATE user
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, password, roles } = req.body

    if (!email) {
      return res.status(400).json({ error: "email is required" })
    }

    const result = await pool.query(
      `INSERT INTO users(name, phone, email, password, roles)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [
        name || null,
        phone || null,
        email,
        password || null,
        JSON.stringify(roles || [])
      ]
    )

    const user = result.rows[0]

    user.roles = JSON.parse(user.roles)

    res.json(user)

  } catch (err) {
    console.error("POST USERS ERROR:", err)

    res.status(500).json({
      error: err.message,
      code: err.code,
      detail: err.detail
    })
  }
})

export default router
