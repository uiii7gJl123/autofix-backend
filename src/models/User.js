import pool from "../config/db.js";

export const createUser = async (name, phone, role) => {
  const result = await pool.query(
    "INSERT INTO users (name, phone, role) VALUES ($1,$2,$3) RETURNING *",
    [name, phone, role]
  );
  return result.rows[0];
};

export const getUsers = async () => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};
