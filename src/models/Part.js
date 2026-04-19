import pool from "../config/db.js";

export const createPart = async (
  name,
  price,
  stock,
  distributorId
) => {
  const result = await pool.query(
    `INSERT INTO parts (name, price, stock, distributor_id)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [name, price, stock, distributorId]
  );

  return result.rows[0];
};

export const getParts = async () => {
  const result = await pool.query("SELECT * FROM parts");
  return result.rows;
};
