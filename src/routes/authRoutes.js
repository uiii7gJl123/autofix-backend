import express from "express"
import pool from "../config/db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const router = express.Router()

/*
POST /auth/login
تسجيل الدخول عبر:
email / phone / username
*/

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body

    if (!identifier || !password) {
      return res.status(400).json({
        error: "identifier and password required"
      })
    }

    // البحث عن المستخدم
    const result = await pool.query(
      `SELECT * FROM users
       WHERE email = $1
       OR phone = $1
       OR username = $1
       LIMIT 1`,
      [identifier]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: "user not found"
      })
    }

    const user = result.rows[0]

    // التحقق من كلمة المرور (آمن)
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({
        error: "invalid password"
      })
    }

    // إنشاء token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    // إزالة كلمة المرور من الرد
    delete user.password

    res.json({
      user,
      token
    })

  } catch (err) {
    console.error("LOGIN ERROR:", err)

    res.status(500).json({
      error: "server error"
    })
  }
})

export default router
